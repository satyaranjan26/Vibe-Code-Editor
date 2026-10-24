# Vibe Editor: Modules Folder Deep-Dive

The **`modules/`** folder follows a modular domain-driven feature structure. Each subfolder corresponds to a core business feature of the app and contains its own **actions** (Next.js Server Actions), **components**, **hooks**, and **utilities**.

---

## 🔒 1. Auth Module (`modules/auth/`)
Handles user authentication and account management.

*   **`actions/index.ts`**
    *   **Function**: Contains Server Actions for authentication. Includes `getAuthenticatedUser()` (verifies user session) and `logout()` (destroys session).
*   **`components/sign-in-form-client.tsx`**
    *   **Function**: Renders the client-side Google OAuth login button. Triggers NextAuth sign-in flows when clicked.
*   **`components/user-button.tsx`**
    *   **Function**: Renders the avatar profile dropdown menu in the top navigation bar. Shows user email, avatar, and logout option.
*   **`components/logout-buttton.tsx`**
    *   **Function**: The button element triggering the logout action.
*   **`types.ts`**
    *   **Function**: TypeScript interface definitions for Auth components (e.g., `LogoutButtonProps`).

---

## 📊 2. Dashboard Module (`modules/dashboard/`)
Handles project management, creating playgrounds, listing user projects, and deleting/starring playgrounds.

*   **`actions/index.ts`**
    *   **Function**: Backend database mutations for the dashboard:
        *   `getAllPlaygroundForUser()`: Fetches all playgrounds owned by the logged-in user from MongoDB.
        *   `createPlayground()`: Creates a new project in MongoDB with initial starter files.
        *   `deleteProjectById()`: Deletes a playground.
        *   `editProjectById()`: Renames a project title/description.
        *   `duplicateProjectById()`: Clones an existing playground.
*   **`components/template-selecting-modal.tsx`**
    *   **Function**: Modal popup triggered when creating a new project. Lets users choose a starter framework (React, Next.js, Hono, Express, Vue) and input a title.
*   **`components/project-table.tsx`**
    *   **Function**: Renders the main table/grid of all user playgrounds with action buttons (Edit, Duplicate, Star, Delete).
*   **`components/add-new.tsx`**
    *   **Function**: The "Create New Playground" dashboard card button.
*   **`components/add-repo.tsx`**
    *   **Function**: The "Import GitHub Repository" card component.
*   **`components/marked-toggle.tsx`**
    *   **Function**: Interactive star toggle button allowing users to favorite specific playgrounds.
*   **`components/empty-state.tsx`**
    *   **Function**: UI placeholder shown when a user has no saved playgrounds.

---

## 💻 3. Playground Module (`modules/playground/`)
Handles the IDE workspace, code editing, and file tree management.

*   **`actions/index.ts`**
    *   **Function**: Backend Server Actions for the IDE workspace:
        *   `getPlaygroundById(id)`: Loads a specific playground's metadata and JSON template files.
        *   `saveTemplateData(id, content)`: Saves modified project code files back to MongoDB.
*   **`hooks/usePlayground.tsx`**
    *   **Function**: Custom React hook that fetches playground data on page load and handles autosaving changes to the database.
*   **`hooks/useFileExplorer.tsx`**
    *   **Function**: Zustand global state store managing:
        *   Open editor tabs (`openFiles`).
        *   Active selected file (`activeFileId`).
        *   Unsaved file status indicators.
        *   Adding, deleting, renaming files/folders in memory.
*   **`components/playground-editor.tsx`**
    *   **Function**: Embeds the **Monaco Code Editor** (VS Code engine). Handles editor themes, auto-completion, active file tab switching, and keyboard shortcuts (`Ctrl+S`).
*   **`components/playground-explorer.tsx`**
    *   **Function**: Recursive file explorer sidebar. Allows users to expand/collapse nested folder structures, right-click to create files/folders, and delete items.
*   **`components/loader.tsx`**
    *   **Function**: Displays progress steps while the workspace environment is initializing.
*   **`lib/editor-config.ts`**
    *   **Function**: Configuration options for Monaco Editor (font size, theme setup, tab sizes, keybindings).
*   **`lib/path-to-json.ts`**
    *   **Function**: Helper functions that convert flat file paths (e.g. `src/components/button.tsx`) into nested JSON tree objects and vice versa.
*   **`lib/index.ts`**
    *   **Function**: Utility helpers for generating unique IDs for newly created files and folders.

---

## ⚡ 4. WebContainers Module (`modules/webcontainers/`)
Handles running Node.js in the browser, dependency installation, and live app previewing.

*   **`hooks/useWebContainer.ts`**
    *   **Function**: Initializes the `@webcontainer/api` WebAssembly virtual machine in the browser. Exports `writeFileSync` to keep browser VM files synchronized with editor edits.
*   **`hooks/transformer.ts`**
    *   **Function**: Translates the application's JSON database file structure into the exact `DirectoryNode` and `FileNode` format required by WebContainers.
*   **`components/webcontainer-preview.tsx`**
    *   **Function**: Manages the 4-step execution lifecycle:
        1. Transforming database files.
        2. Mounting files into the virtual machine.
        3. Spawning `npm install`.
        4. Spawning `npm run dev` and rendering the resulting virtual website URL inside an iframe.
*   **`components/terminal.tsx`**
    *   **Function**: Integrates **Xterm.js** to stream live command logs, build status, and `npm run dev` outputs to the terminal window.

---

## 🏠 5. Home Module (`modules/home/`)
Houses landing page marketing sections and promotional UI blocks.
