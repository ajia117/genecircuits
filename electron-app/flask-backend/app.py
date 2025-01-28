from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/method', methods=['GET', 'POST'])  # Adjust method as needed
def your_method():
    try:
        print("Request data:", request.get_data())
        
        return jsonify({"message": "Success"})
        
    except Exception as e:
        print(f'Error: {e}')
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)