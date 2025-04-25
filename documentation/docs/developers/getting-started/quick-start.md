---
id: environment-setup
sidebar_label: Environment Setup
sidebar_position: 1
slug: /developers/enviroment-setup
---

# Get Started With Developing

Welcome to the Genetic Circuit Tool repository!  
This guide will walk you through setting up the project locally for development, covering both backend (Flask) and frontend (Electron + React + TypeScript).

---
## 🚀 Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Will-Dolan/genetic-circuit-tool.git
cd genetic-circuit-tool
```

### 2. Backend Setup (Flask API)

Navigate to the backend folder:

```bash
cd flask-backend
```

#### Create a Python Virtual Environment

Python 3.10 or higher is required.  
(Production will likely use Python 3.12.)

We recommend using `virtualenv`:

```bash
python3.x -m venv flask-env
source flask-env/bin/activate   # For macOS/Linux
flask-env\Scripts\activate    # For Windows
```

#### Install Backend Dependencies

```bash
pip install -r requirements.txt
```

#### Bundle Backend with PyInstaller

```bash
pyinstaller app.spec
```

### 3. Frontend Setup (Electron + React + TypeScript)

Navigate back to the top-level project directory:

```bash
cd ..
```

#### Check Node.js and npm Versions

- Use **Node.js version 18**
- Use **npm version 10**

Check your versions:

```bash
node -v
npm -v
```

If needed, switch Node version using `nvm`:

```bash
nvm use 18
```

#### Install Frontend Dependencies

```bash
npm install
```

#### Start the Application

```bash
npm run start
```

This command will launch both the Electron app and the local React development server.

---

## 📚 Additional Resources

- [Setup Electron with React TypeScript](https://www.electronforge.io/guides/framework-integration/react-with-typescript)
- [Connect Flask to React](https://dev.to/nagatodev/how-to-connect-flask-to-reactjs-1k8i)
- [Run Frontend and Backend Concurrently](https://medium.com/@rwijayabandu/how-to-run-frontend-and-backend-with-one-command-55d5f2ce952c)

---

## 🐞 Troubleshooting

**Electron Content Security Policy Error when connecting to Flask API**  
Reference:  
[StackOverflow - Electron Content Security Policy error](https://stackoverflow.com/questions/70132291/electron-content-security-policy-error-when-connecting-to-my-api)

---

## 📢 Notes

- Ensure your virtual environments and Node versions are properly activated before running any commands.
- This project uses Electron Forge, Vite, and TypeScript for the frontend, with Flask serving as the backend API.

Happy building! 🚀

