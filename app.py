from flask import Flask, request, render_template, jsonify
from flask_cors import CORS          # NEW: lets Angular (localhost:4200) call this API
import joblib
import json
import os
import pandas as pd
from datetime import datetime

# NEW: all files are found relative to this file, so it works on any computer
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SETTINGS_FILE = os.path.join(BASE_DIR, "current_values.json")

app = Flask(__name__)
# NEW: only these browser origins may call the API (comma-separated list in OT_CORS_ORIGINS).
# In production, serve Angular and Flask from the same domain and CORS is not needed at all.
CORS(app, origins=os.environ.get("OT_CORS_ORIGINS", "http://localhost:4200").split(","))

# NEW: if you set the environment variable OT_ADMIN_KEY, changing settings requires it
# (sent by the Control Panel as the "X-Admin-Key" header). Leave unset for local development.
ADMIN_KEY = os.environ.get("OT_ADMIN_KEY")
@app.route("/")
def dashboard():
    return render_template("dashboard.html")



# ==========================
# Load Model and Encoders
# ==========================
model = joblib.load(os.path.join(BASE_DIR, "ot_readiness_model.pkl"))

surgery_encoder = joblib.load(os.path.join(BASE_DIR, "surgery_encoder.pkl"))

status_encoder = joblib.load(os.path.join(BASE_DIR, "status_encoder.pkl"))




@app.route("/predict", methods=["POST"])
def predict():
    try:

        # ==========================
        # Get JSON Data
        # ==========================
        data = request.json

        # Encode Surgery Type
        surgery_encoded = surgery_encoder.transform(
            [data["Surgery_Type"]]
        )[0]

        # ==========================
        # Create DataFrame
        # ==========================
        input_data = pd.DataFrame({

            "Surgery_Type": [surgery_encoded],
            "Temperature": [data["Temperature"]],
            "Humidity": [data["Humidity"]],
            "Differential_Pressure": [data["Differential_Pressure"]],
            "ACH": [data["ACH"]],
            "CO2": [data["CO2"]],
            "PM2.5": [data["PM2.5"]],
            "PM10": [data["PM10"]],
            "TVOC": [data["TVOC"]],
            "Airflow_Velocity": [data["Airflow_Velocity"]],
            "Light_Intensity": [data["Light_Intensity"]],
            "Noise_Level": [data["Noise_Level"]]

        })

        # ==========================
        # Predict
        # ==========================
        prediction = model.predict(input_data)

        result = status_encoder.inverse_transform(prediction)[0]

        # ==========================
        # Calculate Readiness Score
        # ==========================
        readiness_score = 100
        issues = []

        if data["Temperature"] < 20 or data["Temperature"] > 24:
            readiness_score -= 10
            issues.append("Temperature out of range")

        if data["Humidity"] < 40 or data["Humidity"] > 60:
            readiness_score -= 10
            issues.append("Humidity out of range")

        if data["Differential_Pressure"] < 15 or data["Differential_Pressure"] > 25:
            readiness_score -= 10
            issues.append("Differential Pressure out of range")

        if data["CO2"] > 700:
            readiness_score -= 10
            issues.append("CO2 level high")

        if data["PM2.5"] > 10:
            readiness_score -= 10
            issues.append("PM2.5 level high")

        if data["PM10"] > 20:
            readiness_score -= 10
            issues.append("PM10 level high")

        if data["TVOC"] > 500:
            readiness_score -= 10
            issues.append("TVOC level high")

        if data["Airflow_Velocity"] < 0.20 or data["Airflow_Velocity"] > 0.30:
            readiness_score -= 10
            issues.append("Airflow Velocity out of range")

        if data["Light_Intensity"] < 1000:
            readiness_score -= 10
            issues.append("Light Intensity low")

        if data["Noise_Level"] > 60:
            readiness_score -= 10
            issues.append("Noise Level high")

        readiness_score = max(0, readiness_score)

        # ==========================
        # Response
        # ==========================
        response = {

            "Timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),

            "Surgery_Type": data["Surgery_Type"],

            "OT_Status": result,

            "Readiness_Score": readiness_score,

            "Issues": issues,

            "Temperature": data["Temperature"],

            "Humidity": data["Humidity"],

            "Differential_Pressure": data["Differential_Pressure"],

            "ACH": data["ACH"],

            "CO2": data["CO2"],

            "PM2.5": data["PM2.5"],

            "PM10": data["PM10"],

            "TVOC": data["TVOC"],

            "Airflow_Velocity": data["Airflow_Velocity"],

            "Light_Intensity": data["Light_Intensity"],

            "Noise_Level": data["Noise_Level"]

        }

        return jsonify(response)

    except Exception as e:
        return jsonify({
            "error": str(e)
        })

@app.route("/live", methods=["GET"])
def live_prediction():

    try:
        import json
        import os

        # -----------------------------
        # Read current mode
        # -----------------------------
        with open(SETTINGS_FILE, "r") as file:
            settings = json.load(file)

        mode = settings.get("Mode", "AUTO")

        # -----------------------------
        # MANUAL MODE
        # -----------------------------
        if mode == "MANUAL":
            data = settings

        # -----------------------------
        # AUTO MODE
        # -----------------------------
        else:

            df = pd.read_csv(os.path.join(BASE_DIR, "training_dataset.csv"))

            INDEX_FILE = os.path.join(BASE_DIR, "current_index.txt")

            if not os.path.exists(INDEX_FILE):
                with open(INDEX_FILE, "w") as f:
                    f.write("0")

            with open(INDEX_FILE, "r") as f:
                index = int(f.read())

            if index >= len(df):
                index = 0

            data = df.iloc[index].to_dict()

            with open(INDEX_FILE, "w") as f:
                f.write(str(index + 1))

        # -----------------------------
        # Encode Surgery Type
        # -----------------------------
        surgery_encoded = surgery_encoder.transform(
            [data["Surgery_Type"]]
        )[0]

        # -----------------------------
        # Prepare Model Input
        # -----------------------------
        input_data = pd.DataFrame({

            "Surgery_Type": [surgery_encoded],
            "Temperature": [data["Temperature"]],
            "Humidity": [data["Humidity"]],
            "Differential_Pressure": [data["Differential_Pressure"]],
            "ACH": [data["ACH"]],
            "CO2": [data["CO2"]],
            "PM2.5": [data["PM2.5"]],
            "PM10": [data["PM10"]],
            "TVOC": [data["TVOC"]],
            "Airflow_Velocity": [data["Airflow_Velocity"]],
            "Light_Intensity": [data["Light_Intensity"]],
            "Noise_Level": [data["Noise_Level"]]

        })

        # -----------------------------
        # Prediction
        # -----------------------------
        prediction = model.predict(input_data)
        result = status_encoder.inverse_transform(prediction)[0]

        # -----------------------------
        # Readiness Score
        # -----------------------------
        readiness_score = 100
        issues = []

        if data["Temperature"] < 20 or data["Temperature"] > 24:
            readiness_score -= 10
            issues.append("Temperature out of range")

        if data["Humidity"] < 40 or data["Humidity"] > 60:
            readiness_score -= 10
            issues.append("Humidity out of range")

        if data["Differential_Pressure"] < 15 or data["Differential_Pressure"] > 25:
            readiness_score -= 10
            issues.append("Pressure out of range")

        if data["CO2"] > 700:
            readiness_score -= 10
            issues.append("High CO₂")

        if data["PM2.5"] > 10:
            readiness_score -= 10
            issues.append("High PM2.5")

        if data["PM10"] > 20:
            readiness_score -= 10
            issues.append("High PM10")

        if data["TVOC"] > 500:
            readiness_score -= 10
            issues.append("High TVOC")

        if data["Airflow_Velocity"] < 0.2 or data["Airflow_Velocity"] > 0.3:
            readiness_score -= 10
            issues.append("Airflow out of range")

        if data["Light_Intensity"] < 1000:
            readiness_score -= 10
            issues.append("Low Light")

        if data["Noise_Level"] > 60:
            readiness_score -= 10
            issues.append("High Noise")

        readiness_score = max(0, readiness_score)

        # -----------------------------
        # Response
        # -----------------------------
        data["Timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        data["OT_Status"] = result
        data["Readiness_Score"] = readiness_score
        data["Issues"] = issues

        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)})
# ==========================
# NEW: Control-panel endpoints (replace control_panel.py / Streamlit)
# ==========================
SETTING_KEYS = [
    "Temperature", "Humidity", "Differential_Pressure", "ACH", "CO2",
    "PM2.5", "PM10", "TVOC", "Airflow_Velocity", "Light_Intensity", "Noise_Level",
]
SURGERY_TYPES = ["General Surgery", "Cardiac Surgery", "Neurosurgery", "Orthopedic Surgery"]


@app.route("/settings", methods=["GET"])
def get_settings():
    try:
        with open(SETTINGS_FILE, "r") as f:
            return jsonify(json.load(f))
    except Exception as e:
        return jsonify({"error": str(e)})


@app.route("/settings", methods=["POST"])
def save_settings():
    if ADMIN_KEY and request.headers.get("X-Admin-Key") != ADMIN_KEY:
        return jsonify({"error": "Unauthorized: invalid or missing administrator key"}), 401

    try:
        data = request.json or {}

        mode = data.get("Mode", "AUTO")
        if mode not in ("AUTO", "MANUAL"):
            return jsonify({"error": "Mode must be AUTO or MANUAL"})

        if data.get("Surgery_Type") not in SURGERY_TYPES:
            return jsonify({"error": "Unknown Surgery_Type"})

        new_data = {"Mode": mode, "Surgery_Type": data["Surgery_Type"]}
        for key in SETTING_KEYS:
            if key not in data:
                return jsonify({"error": "Missing value: " + key})
            new_data[key] = float(data[key])

        with open(SETTINGS_FILE, "w") as f:
            json.dump(new_data, f, indent=4)

        return jsonify(new_data)
    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    # NEW: debug mode is OFF unless you set FLASK_DEBUG=1 (debug mode must never be on in production)
    app.run(debug=os.environ.get("FLASK_DEBUG") == "1", port=5000)
