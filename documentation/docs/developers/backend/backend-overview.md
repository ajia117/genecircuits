---
id: backend-overview
title: Backend Overview
sidebar_label: Overview
sidebar_position: 1
slug: overview
---

The Genetic Circuit Tool backend is powered by Flask and scientific computing libraries, providing the core simulation engine and API services for the application. This document outlines the main components and architecture of the backend.

<div class="card-grid">
  <div class="card">
    <div class="card__header">
      <h3><span class="card__icon">📖</span>Backend API Docs</h3>
    </div>
    <div class="card__body">
      <p>Detailed documentation for all available backend endpoints and scripts.</p>
    </div>
    <div class="card__footer">
      <a class="button button--primary" href="/docs/backend/api-overview">View API Docs</a>
    </div>
  </div>

  <div class="card">
    <div class="card__header">
      <h3><span class="card__icon">🧬</span>Biocircuits Background</h3>
    </div>
    <div class="card__body">
      <p>Overview of the biological circuit models and simulation strategies used by the tool.</p>
    </div>
    <div class="card__footer">
      <a class="button button--primary" href="/docs/backend/biocircuits-background">Learn More</a>
    </div>
  </div>
</div>

---

## Interface Overview

The backend architecture is divided into several main responsibilities:
- **API Layer** (Flask app routes and handlers)
- **Simulation Engine** (biocircuits modeling and numerical solvers)
- **Data Processing** (input validation, formatting, and response generation)
- **Bundling** (compiled with PyInstaller for standalone deployment)

---

## Key Dependencies

#### 🧩 Core Backend

| Dependency | Purpose |
|:-----------|:--------|
| `flask` | Web server for serving API routes |
| `numpy` | Numerical operations and matrix manipulation |
| `scipy` | Advanced scientific computing (ODE solvers, etc.) |
| `biological simulation libraries` | Custom biological circuit models and dynamics calculations |

---

## Architecture Notes

The backend focuses on high-performance simulation and clean API exposure:
- Flask routes are minimal and validated for security.
- Simulation logic (ODE solving) is handled using efficient NumPy and SciPy routines.
- Biological models (e.g., Hill functions, promoter logic) are modular and extensible.
- The backend is bundled using **PyInstaller** for seamless integration into the Electron app.

---
