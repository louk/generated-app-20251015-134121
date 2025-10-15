import type { User, Chat, ChatMessage, Product } from './types';
export const MOCK_USERS: User[] = [
  { id: 'User A', name: 'User A', password: 'password123' },
  { id: 'User B', name: 'User B', password: 'password123' }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'General' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'User A', text: 'Hello', ts: Date.now() },
];
const categories = ["Электроник", "Хувцас", "Гэр ахуй", "Гоо сайхан", "Спорт", "Ном", "Хүүхэд"];
const brands = ["Apple", "Samsung", "Nike", "Zara", "IKEA", "L'Oréal", "Adidas", "Sony"];
const colors = ["#252525", "#f5f5f5", "#f44336", "#2196f3", "#4caf50", "#ffeb3b"];
const mongolianAdjectives = ["Шин��", "Гоёмсог", "Хүчтэй", "Ухаалаг", "Загварлаг", "��ав тухтай", "Орчин үеийн", "Дэгжин"];
const mongolianNouns = ["утас", "цамц", "сандал", "тос", "пүүз", "��эвтэр", "тоглоом", "зөөврийн компьютер"];
const generateProductName = (category: string) => {
  const adj = mongolianAdjectives[Math.floor(Math.random() * mongolianAdjectives.length)];
  let noun;
  switch (category) {
    case "Электроник": noun = "утас"; break;
    case "Хувцас": noun = "цамц"; break;
    case "Гэр ахуй": noun = "буйдан"; break;
    case "Гоо сайхан": noun = "тос"; break;
    case "Спорт": noun = "пүүз"; break;
    case "Ном": noun = "ном"; break;
    case "Хүүхэд": noun = "тоглоом"; break;
    default: noun = "бүтээгдэ��үүн";
  }
  return `${adj} ${noun}`;
};
export const MOCK_PRODUCTS: Product[] = Array.from({ length: 200 }, (_, i) => {
  const category = categories[i % categories.length];
  const originalPrice = Math.floor(Math.random() * (500000 - 20000) + 20000);
  const discount = Math.random() * 0.5 + 0.1; // 10% to 60% discount
  const price = Math.floor(originalPrice * (1 - discount));
  return {
    id: `prod_${i + 1}`,
    name: generateProductName(category),
    description: `Энэ бол ${i + 1}-р бүтээгдэхүүний дэлгэрэнгүй мэдээ��эл юм. Энэ нь маш сайн чанартай бөгөөд таны хэрэгцээнд бүрэн нийцнэ.`,
    image: `https://source.unsplash.com/random/400x400?product&sig=${i}`,
    price,
    originalPrice,
    category,
    brand: brands[i % brands.length],
    colors: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => colors[Math.floor(Math.random() * colors.length)]),
    rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // 3.5 to 5.0
    reviews: Math.floor(Math.random() * 200),
    submittedBy: 'User A', // Assign mock user ID by name
  };
});