# Vibe Editor: Complete Learning Roadmap (From Absolute Basics to Advanced)

To understand every single line of code in this project, you need a step-by-step roadmap starting from core web development fundamentals up to modern full-stack web engineering.

---

## 🟢 Level 1: Core Web Fundamentals (The Building Blocks)

Before diving into frameworks, you need to understand how the browser and web standards work.

1. **HTML5**:
   - Semantic elements (`<header>`, `<nav>`, `<main>`, `<iframe>`).
   - Understanding DOM (Document Object Model) tree structure.
2. **CSS3 & Modern Layouts**:
   - Flexbox & CSS Grid (Essential for splitting editor layouts).
   - CSS Variables (`var(--background)` used in Tailwind themes).
3. **JavaScript (ES6+) Core Fundamentals**:
   - Variables (`let`, `const`), Arrow Functions, Object & Array Destructuring.
   - Array methods (`map`, `filter`, `reduce`, `find`).
   - **Asynchronous JavaScript**: Promises, `async/await`, and `fetch` API.
   - **Streams API**: `ReadableStream`, `WritableStream` (used in terminal log streaming).

---

## 🟡 Level 2: Modern Frontend Development

Now you combine JavaScript with React to build dynamic user interfaces.

1. **TypeScript (Crucial for Next.js & Prisma)**:
   - Basic types, Interfaces, Type Aliases.
   - Generics (`Promise<T>`, `useState<T>`).
   - Handling optional props and `null` / `undefined`.
2. **React 19 Core Concepts**:
   - **JSX Syntax**: Writing HTML inside JS/TS.
   - **Components & Props**: Passing data from parent to child components.
   - **React Hooks**:
     - `useState`: Managing local component UI state.
     - `useEffect`: Handling side effects (fetching data, setting up listeners).
     - `useRef`: Holding DOM node references (used for Monaco Editor & Terminal).
     - `useCallback` & `useMemo`: Performance optimizations.
   - **Recursive Components**: Component calling itself (used for the nested File Explorer sidebar).
3. **Tailwind CSS**:
   - Utility-first CSS classes (`flex`, `grid`, `w-full`, `h-screen`, `bg-muted`).
   - Responsive prefixes (`md:grid-cols-2`).
   - **shadcn/ui & Radix UI**: Accessible headless UI primitives built on Tailwind.

---

## 🔵 Level 3: Advanced Frontend & State Management

Handling complex interactive UI features like code editing and state updates across multiple components.

1. **Zustand (Global State Management)**:
   - Creating a store (`create()`).
   - Updating store actions (`set((state) => ...)`).
   - Selecting atomic state values in components to prevent unnecessary re-renders.
2. **Monaco Editor (`@monaco-editor/react`)**:
   - Mounting code editor instances in React.
   - Handling editor events (`onChange`, cursor positions, syntax highlighting configurations).
3. **Xterm.js (Browser Terminal Rendering)**:
   - Canvas-based terminal UI rendering.
   - Writing stream outputs to terminal interfaces (`term.write()`).

---

## 🔴 Level 4: Backend, Database & Server Architecture

Connecting your application to data persistence and authentication.

1. **Node.js Basics**:
   - Node environment, `package.json`, `npm` package management, `scripts`.
2. **MongoDB Atlas (NoSQL Database)**:
   - Documents & Collections vs. SQL Tables.
   - JSON-like data storage.
3. **Prisma ORM**:
   - Writing schemas (`schema.prisma` models, relations, enums).
   - Generating Prisma Client (`npx prisma generate`).
   - Database CRUD operations (`prisma.playground.findUnique()`, `create()`, `update()`, `delete()`).
4. **NextAuth.js (Auth.js v5)**:
   - Authentication protocols (OAuth 2.0 / OpenID Connect).
   - Client ID & Client Secret security.
   - NextAuth configuration (`auth.config.ts`, `auth.ts`, `SessionProvider`).

---

## 🟣 Level 5: Next.js 16 App Router (Full-Stack Framework)

Tying frontend and backend together into a single web application.

1. **File-System Based Routing**:
   - `page.tsx` (Page routes), `layout.tsx` (Layout wrappers).
   - Dynamic Routes (`app/playground/[id]/page.tsx`).
   - Route Groups `(auth)`, `(root)`.
   - API Routes (`app/api/.../route.ts`).
2. **Server Components vs. Client Components**:
   - Understanding the `"use client"` directive.
   - Fetching data directly on the server vs. fetching via client hooks.
3. **Server Actions (`"use server"`)**:
   - Executing backend functions directly from frontend components without building standard REST endpoints.

---

## 🔥 Level 6: Advanced In-Browser Web Virtualization

The most unique and advanced technology in Vibe Editor.

1. **WebAssembly (WASM)**:
   - Running low-level binary code (compiled C/C++/Rust/Node engine) inside the browser engine.
2. **StackBlitz WebContainers (`@webcontainer/api`)**:
   - `WebContainer.boot()`: Booting a virtual Node.js operating system in WebAssembly.
   - `instance.mount()`: Converting JSON tree files into virtual filesystems.
   - `instance.spawn()`: Running terminal commands (`npm install`, `npm run dev`) inside browser micro-VMs.

---

## 🗺️ Recommended Learning Checklist

If you want to study these step-by-step, follow this order:

- [ ] **Step 1:** Modern JavaScript (ES6+ async/await, Array methods)
- [ ] **Step 2:** TypeScript basics (types, interfaces, generics)
- [ ] **Step 3:** React Basics (`useState`, `useEffect`, `useRef`, props)
- [ ] **Step 4:** Next.js App Router (`page.tsx`, `layout.tsx`, `"use client"`)
- [ ] **Step 5:** Tailwind CSS & shadcn/ui
- [ ] **Step 6:** MongoDB & Prisma ORM basics
- [ ] **Step 7:** Zustand (State Management)
- [ ] **Step 8:** NextAuth (Authentication)
- [ ] **Step 9:** WebContainers API & Xterm.js
