from flask import Flask

api = Flask(__name__)

@api.route('/test')
def my_profile():
    response_body = {
        "message": "Hello World!"
    }

    return response_body
