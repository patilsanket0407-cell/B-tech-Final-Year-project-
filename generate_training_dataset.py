import pandas as pd

# Load dataset with surgery type
df = pd.read_csv("ot_environment_with_surgery.csv")

# Function to determine OT readiness
def check_readiness(row):

    surgery = row["Surgery_Type"]

    temp = row["Temperature"]
    humidity = row["Humidity"]
    pressure = row["Differential_Pressure"]
    ach = row["ACH"]
    co2 = row["CO2"]
    pm25 = row["PM2.5"]
    pm10 = row["PM10"]
    tvoc = row["TVOC"]
    airflow = row["Airflow_Velocity"]
    light = row["Light_Intensity"]
    noise = row["Noise_Level"]

    # --------------------------
    # Strict surgeries
    # --------------------------
    if surgery in ["Cardiac Surgery", "Neurosurgery", "Organ Transplant"]:

        ready = (
            20 <= temp <= 22 and
            40 <= humidity <= 55 and
            20 <= pressure <= 25 and
            ach >= 25 and
            co2 <= 700 and
            pm25 <= 10 and
            pm10 <= 20 and
            tvoc <= 300 and
            0.20 <= airflow <= 0.30 and
            800 <= light <= 1200 and
            noise <= 50
        )

    # --------------------------
    # Moderate surgeries
    # --------------------------
    else:

        ready = (
            20 <= temp <= 24 and
            40 <= humidity <= 60 and
            15 <= pressure <= 25 and
            ach >= 20 and
            co2 <= 800 and
            pm25 <= 15 and
            pm10 <= 30 and
            tvoc <= 400 and
            0.15 <= airflow <= 0.35 and
            700 <= light <= 1200 and
            noise <= 60
        )

    return "Ready" if ready else "Not Ready"


# Apply readiness logic
df["Status"] = df.apply(check_readiness, axis=1)

# Save new dataset
df.to_csv("training_dataset.csv", index=False)

print("Training dataset generated successfully!")
print(df["Status"].value_counts())