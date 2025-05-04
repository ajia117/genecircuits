# 🧬 Genetic Circuit Parser Documentation

## 📌 Goal

This parser converts a JSON circuit passed from the frontend into an array of `Protein` objects, which can then be used in the simulation backend.

---

## 🧱 Structure Overview

### 1. **Parse JSON into Variables**

* Extract relevant fields and lists from the JSON structure.

### 2. **Process Node List**

* **New protein types:** Create a new `Protein` object.
* **Mappings:**

  * `type_to_node_id`: Maps protein types to their canonical IDs.
  * `node_id_to_protein`: Maps canonical IDs to their corresponding protein objects.
* **Reassign IDs:**

  * JSON IDs may be unordered; the parser reassigns them starting from 0 for consistency.
  * This involves updating all references to these IDs, including in the edge list.
* **Duplicate protein types:** Only one instance of each protein type is included in the final array. If a protein type appears multiple times, all references point to the same object. For example, if we have Protein type A twice in our circuit, it will only show up once in our protein array, and that object will contain the gates for both nodes of that protein type.

### 3. **Process Nodes for Gates**

* Identify gate-type nodes.
* Store gate data (type, inputs, outputs) in a `gates` dictionary.

### 4. **Process Edges**

* Link gates with their input/output proteins.
* Populate `single_input_edges`:

  * For direct `act_hill`/`rep_hill` interactions, map targets to `[source, edge_type]`.

### 5. **Finalize Gates**

* For each gate in the `gates` map:

  * Pull hill coefficients from the `hill_table`.
  * Construct gate objects and attach them to the `gates` list of the target `Protein`.

### 6. **Process Direct Edges (No Gate Node)**

* For each entry in `single_input_edges`:

  * Retrieve the source/target proteins and relevant hill coefficients.
  * Construct `act_hill`/`rep_hill` gate and attach it to the target protein.

### 7. **Return Result**

* Return the fully constructed array of unique `Protein` objects, each with its corresponding gates.

---

## 🛠️ Debugging Tips

* ✅ Unit tests are located in the `/test` directory. Run with `pytest filename.py`.
* 📄 Logs of parsed JSON and resulting protein arrays are written to `backend_parser_log.txt`.

---