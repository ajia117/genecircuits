---
id: docs-overview
title: Docs Overview
sidebar_label: Overview
slug: docs
sidebar_position: 1
---

# 📚 Documentation Overview

Welcome to the technical documentation for the **Genetic Circuit Tool**.  
This section contains in-depth resources for understanding the frontend and backend architecture, key types, utility functions, and how to contribute to the project effectively.

---

## 📖 What You'll Find Here

The **Docs** tab includes all technical documentation for both the **frontend** and **backend** codebases.  
It is intended to be a resource for developers who are maintaining, extending, or building on top of the project.

- **Frontend Documentation**: Structure, types, components, utilities, and hooks.
- **Backend Documentation**: API contracts, biological models, and simulation engine details.
- **Developer Guides**: How to get started, coding standards, and contribution best practices.

---


## 📦 Best Practices for Organizing Exports

Whenever you add a new file to a folder (e.g., a new component, type, hook, or utility):

1. **Export it in the `index.ts` file** inside that folder.
   
2. **Why?**  
   - It allows other parts of the app to import from the folder directly instead of the individual file path.
   - Improves developer experience by keeping imports clean and easy to manage.

### Example

If you create a new hook `useCustomHook.ts` inside `/hooks`:

```ts
// hooks/useCustomHook.ts
export const useCustomHook = () => { /* logic */ };
```

Then update:

```ts
// hooks/index.ts
export { useCustomHook } from './useCustomHook';
```

Now, anywhere in the app you can simply do:

```ts
import { useCustomHook } from '../hooks';
```

✅ Cleaner  
✅ Easier to maintain  
✅ Matches project organization standards

---

## 🤝 Contribution Guide

We welcome contributions from the community!  
Here are the general guidelines:

1. **Fork and clone the repository** to your local machine.
2. **Work on a new branch** for each feature, enhancement, or fix.
3. **Follow existing code style** conventions (consistent naming, file structure, etc.).
4. **Update the relevant `index.ts`** exports when adding new files.
5. **Write or update documentation** for new functionality where applicable.
6. **Submit a pull request (PR)** with a clear title and description.

✅ Small PRs are preferred  
✅ Add screenshots, diagrams, or example usage when possible  
✅ Link related issues if applicable

---

## 🧠 Need Help?

If you find something unclear or missing, feel free to open an issue or reach out through the repository's discussion board.

Thank you for helping make the Genetic Circuit Tool better! 🚀

