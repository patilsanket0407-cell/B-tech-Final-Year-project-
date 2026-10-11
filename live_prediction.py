import pandas as pd

# Load dataset
df = pd.read_csv("ot_environment.csv")

# Take latest OT reading
latest_data = df.tail(1)

print(latest_data)
# Remove unnecessary columns for ML prediction
input_data = latest_data.drop(
    ["Timestamp", "Readiness_Score", "Status"],
    axis=1
)

print("\nData sent to ML model:")
print(input_data)
import pickle

# Load trained model
with open("ot_readiness_model.pkl", "rb") as file:
    model = pickle.load(file)

# Predict OT status
prediction = model.predict(input_data)

print("\nPredicted OT Status:")
print(prediction[0])