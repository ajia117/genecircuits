## Getting Started
1. Clone repo
   1. If not integrating with the backend, skip to `6`
2. cd into the flask-backend folder
3. Setup a virtual environment
   - `python3 -m venv env`
   - `source env/bin/activate`
4. Install requirements: `pip3 install -r requirements.txt`
5. cd back to electron-react-flask-app directory
6. Check you are using the correct versions of `node` and `npm`
   - Use `node` version 18 and `npm` version 10
   - To check your versions, run `node -v` or `npm -v`
   - To change your version, run `nvm use 18`
7. Run: `npm i`
8. Start app: `npm run start`

## Setup Resources
- Setup Electron app with React TypeScript: https://www.electronforge.io/guides/framework-integration/react-with-typescript
- Connect Flask: https://dev.to/nagatodev/how-to-connect-flask-to-reactjs-1k8i
- Run frontend and backend concurrently: https://medium.com/@rwijayabandu/how-to-run-frontend-and-backend-with-one-command-55d5f2ce952c

## Troubleshooting
- Electron Content Security Policy error when connecting to my api: https://stackoverflow.com/questions/70132291/electron-content-security-policy-error-when-connecting-to-my-api
