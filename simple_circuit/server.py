import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
import simple_parser
from simulate import run_simulation
# from protein import Protein, Gate
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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
        # a_args = (0, 40, 30, 2, 0.5)
        # b_args = (15, 50, 20, 2, 1)
        # proteinArray = [Protein(0, "Protein A", 0.0, 1, 0.0, []), Protein(1, "Protein B", 0.0, 1, 0.00, []), Protein(2, "Protein C", 0.0, 2, 0.1, [Gate("aa_and", 0, 1)]), Protein(3, "Protein D", 0.0, 2, 0.1, [Gate("aa_or", 0, 1)]), Protein(4, "Protein E", 0.0, 0, 0.2, [Gate("ar_and", 3, 2)])]
        final_concentrations = run_simulation(t, proteinArray)

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
        protein_array = simple_parser.parse_circuit(data)  # Ensure parser.py has this function
        
        # Run simulation and get plot
        x_args = (0, 15, 20, 1.0, 0.5)
        a_args = (0, 40, 30, 2, 0.5)

        #proteinArray = [Protein(0, "Protein A", 0.0, 1, 0.0, [], x_pulse, a_args), Protein(1, "Protein B", 0.0, 1, 0.00, [],  x_pulse, b_args), Protein(2, "Protein C", 0.0, 2, 0.1, [Gate("aa_and", 0, 1)]), Protein(3, "Protein D", 0.0, 2, 0.1, [Gate("aa_or", 0, 1)]), Protein(4, "Protein E", 0.0, 0, 0.2, [Gate("ar_and", 3, 2)])]
        
        plot_image = run_backend_simulation(protein_array)
        if isinstance(plot_image, str):
            return jsonify({"error": plot_image}), 500

        return send_file(plot_image, mimetype="image/png")

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
