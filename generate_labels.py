import pandas as pd

# Read dataset
df = pd.read_csv("ot_environment_final.csv")


def check_general_surgery(row):
    return (
        20 <= row["Temperature"] <= 24 and
        40 <= row["Humidity"] <= 60 and
        15 <= row["Differential_Pressure"] <= 25 and
        row["ACH"] >= 20 and
        row["CO2"] <= 800 and
        row["PM2.5"] <= 15 and
        row["PM10"] <= 50 and
        row["TVOC"] <= 500 and
        0.20 <= row["Airflow_Velocity"] <= 0.30 and
        1000 <= row["Light_Intensity"] <= 1500 and
        row["Noise_Level"] <= 60
    )

def check_cardiac_surgery(row):
    return (
        20 <= row["Temperature"] <= 22 and
        40 <= row["Humidity"] <= 55 and
        18 <= row["Differential_Pressure"] <= 25 and
        row["ACH"] >= 25 and
        row["CO2"] <= 700 and
        row["PM2.5"] <= 10 and
        row["PM10"] <= 40 and
        row["TVOC"] <= 400 and
        0.20 <= row["Airflow_Velocity"] <= 0.25 and
        1200 <= row["Light_Intensity"] <= 1600 and
        row["Noise_Level"] <= 55
    )
def check_neurosurgery(row):
    return (
        20 <= row["Temperature"] <= 22 and
        45 <= row["Humidity"] <= 55 and
        20 <= row["Differential_Pressure"] <= 25 and
        row["ACH"] >= 25 and
        row["CO2"] <= 700 and
        row["PM2.5"] <= 10 and
        row["PM10"] <= 40 and
        row["TVOC"] <= 350 and
        0.20 <= row["Airflow_Velocity"] <= 0.25 and
        1200 <= row["Light_Intensity"] <= 1700 and
        row["Noise_Level"] <= 50
    )
def check_orthopedic_surgery(row):
    return (
        20 <= row["Temperature"] <= 23 and
        40 <= row["Humidity"] <= 60 and
        15 <= row["Differential_Pressure"] <= 25 and
        row["ACH"] >= 20 and
        row["CO2"] <= 800 and
        row["PM2.5"] <= 12 and
        row["PM10"] <= 45 and
        row["TVOC"] <= 450 and
        0.20 <= row["Airflow_Velocity"] <= 0.30 and
        1000 <= row["Light_Intensity"] <= 1500 and
        row["Noise_Level"] <= 60
    )

status = []

for _, row in df.iterrows():

    if row["Surgery_Type"] == "General Surgery":
        if check_general_surgery(row):
            status.append("Ready")
        else:
            status.append("Not Ready")

    elif row["Surgery_Type"] == "Cardiac Surgery":
        if check_cardiac_surgery(row):
            status.append("Ready")
        else:
            status.append("Not Ready")

    elif row["Surgery_Type"] == "Neurosurgery":
        if check_neurosurgery(row):
            status.append("Ready")
        else:
            status.append("Not Ready")

    elif row["Surgery_Type"] == "Orthopedic Surgery":
        if check_orthopedic_surgery(row):
            status.append("Ready")
        else:
            status.append("Not Ready")

    else:
        status.append("Pending")

# Create Status column
df["Status"] = status

# Save dataset
df.to_csv("training_dataset.csv", index=False)

# Check results
print(df["Status"].value_counts())