# Vibe Editor: Project File Walkthrough

This document provides a detailed, file-by-file breakdown of the core logic powering your cloud IDE. We will focus on the most important files that make the application work: the Playground logic, the WebContainer execution, the Editor integration, and the Database schema.

---

## 1. The Playground Module (`modules/playground`)

This module handles the UI, state, and file management of the IDE workspace.

### `app/playground/[id]/page.tsx`
**Purpose**: The main layout and entry point for a user's workspace.
**What happens here**:
- It extracts the `id` from the URL to fetch the project data from your database.
- It acts as the "Glue" connecting the Sidebar (File Explorer), the Editor, and the Preview window.
- It uses `react-resizable-panels` to let the user drag and adjust the sizes of the file tree, editor, and preview pane.
- It listens for keyboard shortcuts (like `Ctrl+S`) to trigger save events.

### `hooks/usePlayground.tsx`
**Purpose**: Data fetching and synchronization hook.
**What happens here**:
- It uses `SWR` or standard `fetch` to talk to your Next.js API (`/api/playground/[id]`).
- It loads the initial `TemplateData` (the JSON structure of your project files).
- It provides a `saveTemplateData` function that updates the database whenever a user saves a file.

### `hooks/useFileExplorer.tsx`
**Purpose**: Global state management for the IDE (using Zustand).
**What happens here**:
- Tracks **which files are currently open** in tabs (`openFiles`).
- Tracks the **currently active file** being viewed (`activeFileId`).
- Handles file system logic: creating, renaming, and deleting files/folders within the JSON tree.
- Manages the "unsaved changes" state, placing the little orange dot on tabs when code is modified.

### `components/playground-explorer.tsx`
**Purpose**: The interactive sidebar rendering the file tree.
**What happens here**:
- Uses **recursive React components** (`TemplateFileTree`). If an item is a folder, it renders it and then loops through its children to render them, going infinitely deep.
- Implements context menus (right-click) or dropdowns allowing users to add new files, folders, or delete items.

### `components/playground-editor.tsx`
**Purpose**: The code editor instance (Monaco).
**What happens here**:
- Wraps `@monaco-editor/react`.
- When the `activeFileId` changes in Zustand, this component updates its content to show the code for that specific file.
- It maps the file extension to a language (e.g., `.ts` -> `typescript`) so Monaco can provide syntax highlighting.
- Emits an `onContentChange` event back to the parent layout as the user types, marking the file as unsaved.

---

## 2. The Execution Engine (`modules/webcontainers`)

This module is responsible for taking the code and running it entirely in the user's browser.

### `hooks/useWebContainer.ts`
**Purpose**: Booting and managing the WebContainer virtual machine.
**What happens here**:
- Calls `WebContainer.boot()` when the playground mounts.
- Provides a `writeFileSync` function. When a user creates or saves a file in the UI, this hook simultaneously writes that file directly into the WebContainer's virtual file system so the dev server can detect the change.

### `components/webcontainer-preview.tsx`
**Purpose**: The live preview and setup orchestration.
**What happens here**:
- **Step 1: Transforming**: Takes your database JSON file structure and converts it into the exact format WebContainers requires (`DirectoryNode` and `FileNode`).
- **Step 2: Mounting**: Calls `instance.mount(files)` to load the project into the virtual machine.
- **Step 3: Installing**: Spawns a background process running `npm install`. It pipes the output stream of this installation directly to the Terminal component.
- **Step 4: Starting**: Spawns `npm run dev`. It listens for a `server-ready` event. When the internal server boots up, it grabs the virtual URL and displays it in an `iframe` for the user to preview.

### `components/terminal.tsx`
**Purpose**: Displaying live logs to the user.
**What happens here**:
- Integrates `xterm.js`.
- It takes the raw byte streams from the WebContainer processes (like `npm install` and the dev server logs) and writes them to the terminal UI, giving the user feedback on what's happening under the hood.

---

## 3. Database & Backend (`prisma/schema.prisma`)

This file defines the architecture of your data.

### `model User & Account`
**Purpose**: User authentication.
**What happens here**: 
- Stores user data and links with NextAuth (e.g., Google OAuth credentials). 
- Allows users to own Playgrounds.

### `model Playground`
**Purpose**: The project container.
**What happens here**: 
- Stores metadata about a project (Title, Framework Template like REACT or HONO, and the Owner).

### `model TemplateFile`
**Purpose**: The actual code storage.
**What happens here**: 
- Links directly to a Playground via `playgroundId`.
- The most crucial field is `content Json`. Instead of having a database row for every single file (which is slow), the *entire file and folder structure* of the project is saved here as a single massive JSON tree. When the project loads, Next.js pulls this JSON blob and feeds it to the UI.

---

## 4. System Configuration

### `package.json`
**Purpose**: The blueprint of your application.
**What happens here**:
- Defines scripts (`npm run dev`).
- Lists all dependencies discussed (Next.js, Prisma, WebContainers, Monaco, Zustand, Tailwind).

### `tailwind.config.ts` (or PostCSS equivalent)
**Purpose**: UI Design constraints.
**What happens here**:
- Defines your color variables (CSS variables mapped to Tailwind classes).
- Configures animations and plugins for `shadcn/ui` and Resizable panels.
