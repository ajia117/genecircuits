## Getting Started
1. Clone repo
2. Setup Backend
   1. Go to backend folder `cd react-flask-test/flask-backend`
   2. Create a python environment of your choosing (must be `>=python3.10`, though in prod I will probably use python3.12)
      1. For this, I recommend virtualenv.
      2. Run `python3.xx -m venv flask-env`
   3. `pip install -r requirements.txt`
   4. `pyinstaller app.spec`
3. Setup Frontend
   1. Go back to top directory: `cd electron-react-flask-app` 
   2. Check you are using the correct versions of `node` and `npm`
      - Use `node` version 18 and `npm` version 10
      - To check your versions, run `node -v` or `npm -v`
      - To change your version, run `nvm use 18`
   3. Run: `npm i`
4. Start app: `npm run start`

## Setup Resources
- Setup Electron app with React TypeScript: https://www.electronforge.io/guides/framework-integration/react-with-typescript
- Connect Flask: https://dev.to/nagatodev/how-to-connect-flask-to-reactjs-1k8i
- Run frontend and backend concurrently: https://medium.com/@rwijayabandu/how-to-run-frontend-and-backend-with-one-command-55d5f2ce952c

## Troubleshooting
- Electron Content Security Policy error when connecting to my api: https://stackoverflow.com/questions/70132291/electron-content-security-policy-error-when-connecting-to-my-api
