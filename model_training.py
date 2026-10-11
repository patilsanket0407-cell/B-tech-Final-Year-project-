# ==============================
# Load Dataset
# ==============================
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# Load Dataset
df = pd.read_csv(r"C:\Users\admin\Documents\myprograms\OT_Readiness_Prediction_System\training_dataset.csv")

# Encode Surgery_Type
surgery_encoder = LabelEncoder()
df["Surgery_Type"] = surgery_encoder.fit_transform(df["Surgery_Type"])

# Encode Status
status_encoder = LabelEncoder()
df["Status"] = status_encoder.fit_transform(df["Status"])

# Features
X = df[
    [
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
        "Noise_Level",
    ]
]

# Target
y = df["Status"]

# Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Train Model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

# Prediction
y_pred = model.predict(X_test)

# Results
print("\n========== MODEL RESULTS ==========\n")
print("Accuracy:", round(accuracy_score(y_test, y_pred) * 100, 2), "%")

print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:\n")
print(confusion_matrix(y_test, y_pred))

# Save Model and Encoders
joblib.dump(model, "ot_readiness_model.pkl")
joblib.dump(surgery_encoder, "surgery_encoder.pkl")
joblib.dump(status_encoder, "status_encoder.pkl")

print("\nModel and Encoders Saved Successfully!") 