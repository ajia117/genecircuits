from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

@app.route('/test', methods=['POST'])
def test_server():
    try:
        random_number = random.randint(0, 100)
        print(f"Generated Random Number: {random_number}")  
        return jsonify({"message": f"Random Number: {random_number}"})  
    except Exception as e:
        print(f'Error: {e}')
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
