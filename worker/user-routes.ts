import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, ProductEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { Product, User } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // --- AUTH ROUTES ---
  app.post('/api/auth/register', async (c) => {
    const { name, password } = await c.req.json<Partial<User>>();
    if (!isStr(name) || !isStr(password) || password.length < 6) {
      return bad(c, 'Username and a password of at least 6 characters are required.');
    }
    const userEntity = new UserEntity(c.env, name);
    if (await userEntity.exists()) {
      return bad(c, 'User with this name already exists.');
    }
    // In a real app, hash the password here. For this demo, we store it as is.
    // Set the ID to the name to align with the entity's keyOf method.
    const newUser: User = { id: name, name, password };
    await UserEntity.create(c.env, newUser);
    const { password: _, ...userToReturn } = newUser;
    return ok(c, userToReturn);
  });
  app.post('/api/auth/login', async (c) => {
    const { name, password } = await c.req.json<Partial<User>>();
    if (!isStr(name) || !isStr(password)) {
      return bad(c, 'Username and password are required.');
    }
    // Look up the user by name, which is now the entity key.
    const userEntity = new UserEntity(c.env, name);
    if (!(await userEntity.exists())) {
      return notFound(c, 'User not found.');
    }
    const user = await userEntity.getState();
    // In a real app, compare hashed passwords.
    if (user.password !== password) {
      return bad(c, 'Invalid credentials.');
    }
    const { password: _, ...userToReturn } = user;
    // In a real app, generate and return a JWT.
    return ok(c, { user: userToReturn, token: `mock-token-for-${user.id}` });
  });
  // --- PRODUCT ROUTES ---
  app.get('/api/products', async (c) => {
    await ProductEntity.ensureSeed(c.env);
    const page = await ProductEntity.list(c.env, null, 200);
    return ok(c, page.items);
  });
  app.get('/api/products/:id', async (c) => {
    const id = c.req.param('id');
    const product = new ProductEntity(c.env, id);
    if (!(await product.exists())) {
      return notFound(c, 'Product not found');
    }
    return ok(c, await product.getState());
  });
  app.post('/api/products', async (c) => {
    // In a real app, this would be a protected route that checks the auth token.
    const body = await c.req.json<Omit<Product, 'id' | 'rating' | 'reviews' | 'colors'>>();
    if (!isStr(body.submittedBy)) {
      return bad(c, 'submittedBy is a required field.');
    }
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      ...body,
      colors: ["#252525", "#f5f5f5"], // Mock colors
      rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // 3.5 to 5.0
      reviews: Math.floor(Math.random() * 50),
    };
    await ProductEntity.create(c.env, newProduct);
    return ok(c, newProduct);
  });
  app.put('/api/products/:id', async (c) => {
    // In a real app, this would be a protected route.
    const id = c.req.param('id');
    const body = await c.req.json<Partial<Omit<Product, 'id'>>>();
    const productEntity = new ProductEntity(c.env, id);
    if (!(await productEntity.exists())) {
      return notFound(c, 'Product not found');
    }
    const updatedProduct = await productEntity.mutate(current => ({ ...current, ...body }));
    return ok(c, updatedProduct);
  });
  app.delete('/api/products/:id', async (c) => {
    // In a real app, this would be a protected route.
    const id = c.req.param('id');
    const deleted = await ProductEntity.delete(c.env, id);
    if (!deleted) {
      return notFound(c, 'Product not found');
    }
    return ok(c, { id });
  });
  // --- USER-SPECIFIC ROUTES ---
  app.get('/api/users/:userId/products', async (c) => {
    const userId = c.req.param('userId');
    await ProductEntity.ensureSeed(c.env);
    const page = await ProductEntity.list(c.env, null, 200);
    const userProducts = page.items.filter(p => p.submittedBy === userId);
    return ok(c, userProducts);
  });
  // --- DEMO ROUTES (unchanged) ---
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'CF Workers Demo' }}));
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const page = await UserEntity.list(c.env, null, 100);
    return ok(c, page.items.map(({password: _, ...u}) => u));
  });
  app.get('/api/chats', async (c) => {
    await ChatBoardEntity.ensureSeed(c.env);
    const page = await ChatBoardEntity.list(c.env, null, 100);
    return ok(c, page.items);
  });
  app.get('/api/chats/:chatId/messages', async (c) => {
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.listMessages());
  });
  app.post('/api/chats/:chatId/messages', async (c) => {
    const chatId = c.req.param('chatId');
    const { userId, text } = (await c.req.json()) as { userId?: string; text?: string };
    if (!isStr(userId) || !text?.trim()) return bad(c, 'userId and text required');
    const chat = new ChatBoardEntity(c.env, chatId);
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.sendMessage(userId, text.trim()));
  });
}