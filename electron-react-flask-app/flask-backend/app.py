from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/test')
def my_profile():
    response_body = {
        "message": "Hello World!"
    }

    return response_body

if __name__ == '__main__':
	app.run(debug=True, port=5000)