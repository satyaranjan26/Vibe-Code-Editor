# Vibe Editor: Technical Interview Questions & Answers Guide

This guide is divided into three sections:
1. **Core Web Dev & Next.js Fundamentals** (Basics interviewers check first)
2. **Project-Specific Deep Dives** (How your Vibe Editor works under the hood)
3. **Advanced System Design & Edge-Case Questions** (To stand out in Senior/SDE-1 rounds)

---

## 🟢 Section 1: Web Dev & Next.js Fundamentals

### Q1: What is the difference between Server Components and Client Components in Next.js (App Router)?
**Answer:**
- **Server Components (default in App Router):** Render strictly on the Node.js server. They do not ship any JavaScript to the browser, reducing bundle size. They can directly fetch data from databases (like Prisma/MongoDB) without needing an API route or exposing API keys.
- **Client Components (`"use client"`):** Render on the server for initial HTML shell, then hydrate on the browser. They allow interactive features like React state (`useState`, `useEffect`), DOM event listeners, browser-only APIs, and client hooks (like Monaco Editor or Zustand).

### Q2: Why did you use Zustand over Context API or Redux?
**Answer:**
- **Redux** introduces significant boilerplate (actions, reducers, dispatchers) which is overkill for client-side IDE state.
- **Context API** suffers from unnecessary re-render issues: whenever a context state changes, *all* consuming components re-render unless carefully optimized with `useMemo`/`useCallback`.
- **Zustand** is a lightweight atomic state manager. It uses selector functions (e.g., `useFileExplorer(state => state.activeFileId)`), ensuring that only the specific UI components subscribed to that precise piece of state re-render.

### Q3: What is the difference between `localStorage` and HTTP-Only Cookies for storing Session Tokens?
**Answer:**
- `localStorage` is accessible via JavaScript on the window object, making it vulnerable to **Cross-Site Scripting (XSS)** attacks (a malicious script injected into the app can read the token).
- **HTTP-Only Cookies** (used by NextAuth) cannot be accessed or read by client-side JavaScript. The browser automatically attaches them to outgoing HTTP requests, shielding session tokens from XSS attacks.

### Q4: What is the role of `.env` files, and why shouldn't they be committed to Git?
**Answer:**
`.env` files hold environment-specific configuration variables and sensitive credentials (such as `DATABASE_URL`, `AUTH_SECRET`, and `AUTH_GOOGLE_SECRET`). They should never be committed to Git because exposing secrets in source control allows unauthorized access to production databases and cloud services. They are listed in `.gitignore` and injected into the server environment at deployment.

---

## 🔵 Section 2: Project-Specific Architecture Questions

### Q5: Can you explain the overall high-level architecture of Vibe Editor?
**Answer:**
Vibe Editor is a full-stack, browser-based cloud IDE built on **Next.js 16 (App Router)**.
1. **Database & Auth:** Uses Prisma ORM connected to MongoDB Atlas for storing users, project metadata, and project file trees. Auth is handled by NextAuth (Google/GitHub OAuth).
2. **Editor Interface:** Built with Monaco Editor (`@monaco-editor/react`) for code editing, with file tree management powered by Zustand.
3. **Execution Engine:** Uses **StackBlitz WebContainers (`@webcontainer/api`)**. When a project loads, WebContainers boots a WebAssembly Node.js micro-VM directly in the user's browser, mounts the files, runs `npm install`, and spawns `npm run dev`.
4. **Terminal Output:** Integrates **Xterm.js** to stream `stdout`/`stderr` from the WebContainer environment in real time.

### Q6: How do WebContainers work, and why did you choose them over server-side Docker containers?
**Answer:**
- **Traditional Cloud IDEs (e.g., Replit/CodeSandbox classic):** Spin up a remote server/Docker container per user. This requires heavy backend infrastructure, incurs high hosting costs, and has network latency.
- **WebContainers:** Boot a full Node.js environment *inside the user's browser* using WebAssembly (WASM). 
- **Benefits:** Zero backend hosting costs for code execution, sub-second startup times, instantaneous file operations, and offline capabilities.

### Q7: How do you store file and folder structures in MongoDB?
**Answer:**
Instead of storing each file as an individual row in MongoDB (which leads to hundreds of small database queries and complex join logic), the entire file/folder hierarchy is serialized and stored as a single `Json` blob in the `TemplateFile` model (`content Json`). 
When a user opens a playground, Next.js fetches this single JSON structure. The client parses it into a tree structure, allowing instant rendering and easy file system mounting into WebContainers.

### Q8: How does the file explorer sidebar render infinitely nested folders?
**Answer:**
The `TemplateFileTree` component uses a **Recursive React Component** pattern:
- It iterates through the root array of items.
- If an item is a `File`, it renders a file row.
- If an item is a `Folder`, it renders a collapsible folder header and then **recursively renders `<TemplateFileTree>`** passing the folder's `items` array as props.

---

## 🟣 Section 3: Advanced Edge Cases & System Design

### Q9: How do you keep the Monaco Editor, WebContainer filesystem, and MongoDB in sync when a user edits code?
**Answer:**
1. **User Types Code:** Monaco Editor triggers `onContentChange`, updating local state and updating the file's `hasUnsavedChanges` flag to `true` in Zustand (showing the orange dot on the tab).
2. **User Hits Save (`Ctrl+S`):**
   - The file content is written to WebContainers in memory using `webcontainerInstance.fs.writeFile(filePath, content)`, causing the dev server inside the browser to hot-reload immediately.
   - Simultaneously, a Next.js Server Action (`saveTemplateData`) updates the JSON payload in MongoDB Atlas to ensure long-term persistence.

### Q10: How do you stream `npm install` logs to the terminal UI without blocking the React main thread?
**Answer:**
WebContainers expose process outputs as Node.js / Web Streams (`WritableStream` / `ReadableStream`).
- When `instance.spawn('npm', ['install'])` is executed, we pipe the `process.output` stream directly to Xterm.js's `terminalRef.current.writeToTerminal(data)` method.
- This streams terminal characters in real-time asynchronously without locking up React re-renders.

### Q11: What was a challenging bug you encountered in this project, and how did you resolve it?
**Answer:**
- **Issue:** WebContainer failed to boot the development server with error `npm run start not found`.
- **Root Cause Analysis:** The preview component was spawning `npm run start`, but the starter templates (like Hono) only defined a `"dev": "tsx watch src/index.ts"` script in `package.json`.
- **Fix:** Analyzed the terminal log outputs and modified `webcontainer-preview.tsx` to spawn `["npm", "run", "dev"]` instead, matching the template's available scripts.

### Q12: How would you scale this application to support Real-Time Collaboration (like Google Docs or Figma)?
**Answer:**
To support multiple users editing the same file simultaneously:
1. **WebSocket / WebRTC Layer:** Implement a real-time server using Socket.io or WebRTC.
2. **Operational Transformation (OT) or CRDTs (Conflict-free Replicated Data Types):** Integrate Yjs or Automerge into Monaco Editor (e.g., `y-monaco`). This ensures concurrent code edits merge deterministically across users without overwriting each other's changes.
