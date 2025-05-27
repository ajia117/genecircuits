## Getting Started

1. Clone repo
2. Setup Backend
   1. Go to backend folder `cd /backend`
   2. Create a python environment of your choosing (must be `>=python3.10`, though in prod I will probably use python3.12)
      1. For this, I recommend virtualenv.
      2. Run `python3.xx -m venv flask-env`
   3. `pip install -r requirements.txt`
   4. `pyinstaller app.spec`
3. Setup Frontend
   1. Go back to the top directory
   2. Check you are using the correct versions of `node` and `npm`
      - Use `node` version 18 and `npm` version 10
      - To check your versions, run `node -v` or `npm -v`
      - To change your version, run `nvm use 18`
   3. Run: `npm i`
4. Start app: `npm run start`
