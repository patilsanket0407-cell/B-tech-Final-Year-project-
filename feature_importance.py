import joblib
import pandas as pd

# Load model
model = joblib.load("ot_readiness_model.pkl")

features = [
    "Surgery_Type",
    "Temperature",
    "Humidity",
    "Differential_Pressure",
    "ACH",
    "CO2",
    "PM2.5",
    "PM10",
    "TVOC",
    "Airflow_Velocity",
    "Light_Intensity",
    "Noise_Level"
]

importance = pd.DataFrame({
    "Feature": features,
    "Importance": model.feature_importances_
})

print(importance.sort_values(by="Importance", ascending=False))
