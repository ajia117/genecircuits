---
id: app-architecture
title: App Architecture
sidebar_label: App Architecture
sidebar_position: 2
slug: /developers/app-architecture
---

The Genetic Circuit Tool is built as an Electron application with a React frontend and a Flask backend. This page provides an overview of the application's architecture and project structure.

## Project Structure

```
genetic-circuit-tool/
├── documentation/        # Docusaurus documentation site
│   ├── docs/             # All markdown files for doc pages
│   ├── src/              # HTML and CSS code for pages
│   ├── static/           # Static assets for documentation (images, icons)
├── flask-backend/        # Python Flask backend server
├── src/                  # Frontend source code
│   ├── assets/           # Static assets (images, icons)
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── app.tsx           # Main application component
│   ├── index.ts          # Entry point
│   ├── preload.ts        # Electron preload script
│   └── renderer.ts       # Renderer process
├── .github/              # GitHub workflows and templates
├── .webpack/             # Webpack build artifacts
├── forge.config.ts       # Electron Forge configuration
├── webpack.*.config.ts   # Webpack configurations
└── package.json          # Project dependencies and scripts
```

---

## Architecture Overview

### Frontend (Electron + React)

The frontend is built using Electron and React, providing a desktop application experience with web technologies.

#### Key Components:

1. **Main Process (`src/index.ts`)**
   - Manages the application lifecycle
   - Handles IPC (Inter-Process Communication)
   - Manages window creation and system events

2. **Renderer Process (`src/renderer.ts`)**
   - Renders the React application
   - Handles UI interactions
   - Communicates with the main process

3. **React Components (`src/components/`)**
   - `CircuitBuilderFlow.tsx`: Main circuit builder interface
   - Other UI components for circuit design and visualization

4. **State Management**
   - Uses React hooks for local state
   - Custom hooks in `src/hooks/` for shared logic

### Backend (Flask)

The backend is a Python Flask server that handles:
- Circuit simulation
- Data processing
- File operations
- API endpoints for frontend communication

### Documentation

The official [Genetic Circuit Tool](https://ionicframework.com) documentation, built with [Docusaurus](https://docusaurus.io/). Refer to the [Documentation Guide](/docs/developers/documentation-guide) for more instructions on how the documentation website was built and instructions on how to add to it.

---

## Key Features

### Circuit Builder

The core of the application is the circuit builder, which allows users to:
- Drag and drop genetic components
- Connect components to create circuits
- Configure component properties
- Simulate circuit behavior

### Simulation Engine

The simulation engine:
- Processes circuit designs
- Runs biological simulations
- Generates results and visualizations
- Handles parameter optimization


## Contributing

When contributing to the project:
1. Follow the project structure
2. Use TypeScript for frontend code
3. Write tests for new features
4. Update documentation as needed

## Future Improvements

Planned architectural improvements:
- Enhanced state management
- Improved simulation performance
- Better error handling
- More modular component system

For more detailed information about specific components or features, refer to their respective documentation sections.
