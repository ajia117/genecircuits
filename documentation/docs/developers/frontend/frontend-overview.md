---
id: frontend-overview
sidebar_label: Overview
sidebar_position: 1
slug: overview
---

# Frontend Overview

The Genetic Circuit Tool frontend is built using React and Electron, providing a powerful desktop application interface for genetic circuit design. This document outlines the main components and architecture of the frontend.

<div class="card-grid">
  <div class="card">
    <div class="card__header">
      <h3><span class="card__icon">📖</span>Documentation</h3>
    </div>
    <div class="card__body">
      <p>Comprehensive documentation covering all aspects of the app's functionality.</p>
    </div>
    <div class="card__footer">
      <a class="button button--primary" href="/docs/docs/overview">Read Documentation</a>
    </div>
  </div>

  <div class="card">
    <div class="card__header">
      <h3><span class="card__icon">🎨</span>Style Guide</h3>
    </div>
    <div class="card__body">
      <p>Guidelines on the app's branding kit, the visual UI choices, assets, and themes.</p>
    </div>
    <div class="card__footer">
      <a class="button button--primary" href="/docs/tutorials/basic-circuit">View Styles</a>
    </div>
  </div>
</div>

## Graphical User Interface (GUI)

The application interface is divided into several main sections:
- **Ribbon** (top navigation and actions)
- **Left Pane** (toolbox and properties)
- **Circuit Builder** (main workspace)
- **Output Window** (simulation results and analysis)

---

## 🖥️ Frontend Architecture

The frontend is built using **React**, **Electron**, and **TypeScript**.  
The source code is organized into logical folders:

### Folders

| Folder | Purpose |
|:-------|:--------|
| `/components` | React components used in the UI (Ribbon, Toolbox, Node Editor, etc.). |
| `/types` | TypeScript types and interfaces shared across the application (e.g., `NodeData`, `ProteinData`). |
| `/hooks` | Custom React hooks for state management, fetching data, and user interactions. |
| `/utils` | Reusable helper functions and utilities (e.g., formatting JSON, syncing counters). |

Each folder is structured to keep related logic grouped together, improving maintainability and scalability.

---

## Key Dependencies

#### 🧩 Core Framework

| Dependency | Version | Purpose |
|:-----------|:--------|:--------|
| `react` | ^18.0.0 | Frontend framework |
| `electron` | ^25.0.0 | Desktop application shell |
| `typescript` | ^4.5.0 | Type safety and development |

#### 🎨 UI Components

| Dependency | Purpose |
|:-----------|:--------|
| `@radix-ui/themes` | Core UI and theming system |
| `reactflow` | Circuit builder workspace and node management |
| `lucide-react` | Icon system for buttons and panels |

#### 🗄️ Data Management

| Dependency | Purpose |
|:-----------|:--------|
| `zustand` | Global state management (lightweight) |
| `immer` | Immutability support for state updates |

#### 📊 Visualization

| Dependency | Purpose |
|:-----------|:--------|
| `d3` | Low-level data visualization (e.g., curves, graphs) |
| `chart.js` | Time-series plotting for simulation results |

