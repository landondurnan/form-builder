# Form Builder

A modern, type-safe visual form builder built with React, TypeScript, and Vite. Design forms visually, export/import them as JSON schemas, and render them with full validation support.

## Project Overview

This project demonstrates system thinking, component quality, and user experience craft. The application enables users to:

- **Design forms visually** with an intuitive builder interface
- **Render working forms** with validation and mock submission
- **Test forms** with a live preview including error handling

### Architecture Philosophy

The project is built on three core principles:

- **Modularity**: Builder (form design), Schema (data structure), and Preview (runtime validation) are cleanly separated
- **Reusability**: Generic, composable components that can scale into a broader form system
- **Type Safety**: Full TypeScript support with schema-driven validation using Zod

## Features

### Core Form Builder

- ✅ Add, remove, and reorder form fields
- ✅ Editable field properties: label, name, placeholder, helpText, required, defaultValue
- ✅ Support for all field types: text, textarea, number, select, radio, checkbox, date

### Validation System

- ✅ Required field validation
- ✅ Min/max constraints for numeric and text fields
- ✅ Regex pattern matching with predefined patterns and custom regex
- ✅ Human-friendly error messages powered by Zod
- ✅ Real-time validation feedback

### State Management & Persistence

- ✅ Builder/Preview mode system for seamless design and testing
- ✅ localStorage persistence (save, load, reset forms)
- ✅ Context-based global state for mode switching
- ✅ Live form preview with JSON schema visualization

### Schema & Export

- ✅ JSON Schema export for forms
- ✅ Language-agnostic schema format for backend integration

## Tech Stack

### Core Framework

- **React 19** - UI library
- **TypeScript 5.9** - Type safety and developer experience
- **Vite 7** - Fast build tool and dev server

### Form & Validation

- **TanStack Form** - Flexible, headless form library
- **Zod 4** - TypeScript-first schema validation
- **React Hook Form** - Form state management

### Routing & Navigation

- **TanStack Router** - Type-safe routing for React apps

### UI & Styling

- **shadcn/ui** - High-quality, accessible React components
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component primitives

### Utilities & Notifications

- **Sonner** - Toast notifications
- **Lucide React** - Icon library
- **clsx** - Class name utilities

### Developer Tools

- **TanStack DevTools** - React Form and Router debugging
- **ESLint** - Code quality linting
- **SWC** - Fast TypeScript compilation

## Getting Started

### Prerequisites

- Node.js 22+ (see `.nvmrc` for the exact version, or use `nvm install`)
- Bun package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd form-builder
   ```

2. **Install Node version (if using nvm)**

   ```bash
   nvm install
   ```

3. **Install dependencies**

   ```bash
   bun install
   ```

4. **Start the development server**

   ```bash
   bun dev
   ```

   The application will be available at `http://localhost:5173`

### Available Scripts

- `bun dev` - Start development server with HMR
- `bun build` - Compile TypeScript and build for production
- `bun preview` - Preview production build locally
- `bun lint` - Run ESLint to check code quality

## Project Structure

```
src/
├── components/
│   ├── builder/          # Form builder UI components
│   │   ├── Builder.tsx
│   │   ├── FormPreview.tsx
│   │   ├── AddFieldForm.tsx
│   │   └── ...
│   ├── form/             # Reusable form field components
│   │   ├── FormBase.tsx
│   │   ├── FormInput.tsx
│   │   ├── FormSelect.tsx
│   │   └── ...
│   └── ui/               # shadcn/ui components
├── context/              # React context for global state
│   └── BuilderContext.tsx
├── lib/                  # Utility functions
│   ├── formUtils.ts
│   ├── schemaUtils.ts
│   ├── storageUtils.ts
│   └── types.ts
├── routes/               # TanStack Router pages
│   ├── __root.tsx
│   ├── index.tsx
│   └── about.tsx
└── main.tsx              # Entry point
```

## How to Use

### Builder Mode

1. Navigate to the form builder interface
2. Click "Add Field" to create form fields
3. Configure field properties (label, type, validation rules)
4. Set required fields, add placeholders, and configure options for select/radio/checkbox
5. Click "Save Form" to persist to localStorage

### Preview Mode

1. Switch to Preview mode using the toggle button
2. Fill out the form to test validation in real-time
3. Submit to see validation errors and what would be submitted to the server

## Development Notes

For detailed insights into the project's architecture, design decisions, and planning approach, see [APPROACH.md](./APPROACH.md).

### TypeScript Configuration

- Strict mode enabled for maximum type safety
- Path aliases configured for clean imports
- Both app and node configuration files for proper module resolution

### Component Architecture

- Components follow a modular design with clear prop contracts
- Validation logic is centralized in Zod schemas
- Form state is managed through TanStack Form and localStorage

### Styling

- Tailwind CSS v4 with Vite integration
- Theme variables defined in CSS for consistency
- Responsive design patterns throughout

## Future Enhancements

- Conditional field visibility (e.g., show "State" only if country === "US")
- Mock submission with simulated latency and random success/failure
- Field reordering UI
- Field templates and presets
