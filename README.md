# Orgil Deals

A modern, visually-driven daily deal marketplace for Mongolia, offering a curated selection of discounted products with advanced filtering.

Orgil Deals is a visually stunning and modern daily deal marketplace designed for the Mongolian market. The application provides a curated shopping experience, showcasing a wide variety of products with significant discounts. The core of the application is a beautifully designed product showcase page featuring a responsive grid of deals. Users can effortlessly browse, search, and filter through products using an intuitive and accessible filtering system. The platform emphasizes visual appeal, with high-quality imagery, sophisticated typography, and smooth micro-interactions to create a delightful and engaging user journey. The entire user interface is presented in the Mongolian language to cater specifically to the local audience.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/louk/generated-app-20251015-134121)

## ✨ Key Features

- **Modern UI/UX:** Clean, premium design focused on visual appeal and user experience.
- **Daily Deals Showcase:** A responsive grid displaying a wide variety of discounted products.
- **Advanced Filtering:** Powerful client-side filtering by category, price range, brand, and color.
- **Mongolian Language Support:** Fully localized for the Mongolian market.
- **Performance-Optimized:** Built for a fast, seamless browsing experience without page reloads for filtering.
- **Responsive Perfection:** Flawless layouts across all device sizes, from mobile to desktop.

## 🚀 Technology Stack

- **Frontend:** [React](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
- **UI:** [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Backend:** [Hono](https://hono.dev/) on [Cloudflare Workers](https://workers.cloudflare.com/)
- **Storage:** [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)

## 🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later recommended)
- [Bun](https://bun.sh/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/orgil_deals.git
    cd orgil_deals
    ```

2.  **Install the dependencies:**
    ```bash
    bun install
    ```

### Running the Development Server

To start the local development server, which includes both the Vite frontend and the Wrangler worker backend, run:

```bash
bun dev
```

The application will be available at `http://localhost:3000`.

## 📂 Project Structure

The project is organized into three main directories:

- `src/`: Contains the entire React frontend application, including pages, components, hooks, and styles.
- `worker/`: Contains the Hono backend application that runs on Cloudflare Workers.
- `shared/`: Contains TypeScript types and mock data that are shared between the frontend and the worker.

## 部署 (Deployment)

This project is designed for seamless deployment to the Cloudflare network.

1.  **Build the project:**
    ```bash
    bun build
    ```

2.  **Deploy to Cloudflare:**
    Make sure you are logged into your Cloudflare account via the Wrangler CLI. Then, run the deploy command:
    ```bash
    bun deploy
    ```
    This command will build the application and deploy it to your Cloudflare account.

Alternatively, you can deploy directly from your GitHub repository with a single click:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/louk/generated-app-20251015-134121)

## 📜 Available Scripts

In the project directory, you can run:

- `bun dev`: Runs the app in development mode.
- `bun build`: Builds the app for production.
- `bun deploy`: Deploys the app to Cloudflare Workers.
- `bun lint`: Lints the codebase using ESLint.