import numpy as np
import matplotlib
import matplotlib.pyplot as plt
import io
import parser
from simulate import run_simulation
# from protein import Protein, Gate
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
matplotlib.use('Agg')

def run_backend_simulation(proteinArray):
    """
    Runs the simulation using the provided protein array and returns the plot as an image.
    """
    try:
        # Define simulation parameters
        duration = 20
        n = 1000
        t = np.linspace(0, duration, n)

        # Run the simulation
        final_concentrations = run_simulation(t, proteinArray)
        if not final_concentrations or len(final_concentrations) == 0:
            return None

        # Plot results using matplotlib
        plt.figure()
        for i, protein in enumerate(proteinArray):
            plt.plot(t, final_concentrations[:, i], label=protein.getName())

        plt.xlabel("Time")
        plt.ylabel("Concentration")
        plt.legend()

        # Save plot to an in-memory buffer
        buf = io.BytesIO()
        plt.savefig(buf, format="png")
        buf.seek(0)

        return buf

    except Exception as e:
        return str(e)

@app.route('/run-simulation', methods=['POST'])
def run_simulation_route():
    try:
        # Get JSON data from frontend
        data = request.get_json()
        
        # Parse data into protein objects
        # TODO: add try / catch block to catch errors in parsing and return proper code
        try:
            protein_array = parser.parse_circuit(data)
        except Exception as parse_error:
            return jsonify({"error": f"Parse error: {str(parse_error)}"}), 400

        plot_image = run_backend_simulation(protein_array)
        print('got plot image')
        if not plot_image:
            print('no plot image')
            return jsonify({"bad request": f"No Circuit Provided"}), 200

        if isinstance(plot_image, str):
            return jsonify({"error": f"Simulation error: {plot_image}"}), 500

        return send_file(plot_image, mimetype="image/png")

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
