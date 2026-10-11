import pandas as pd
import numpy as np
import random

# ======================================================
# CONFIGURATION
# ======================================================

START_DATE = "2026-01-01 00:00:00"
END_DATE = "2026-01-30 23:55:00"

ABNORMAL_PERCENTAGE = 0.15

timestamps = pd.date_range(
    start=START_DATE,
    end=END_DATE,
    freq="5min"
)

TOTAL_ROWS = len(timestamps)

# ======================================================
# NORMAL RANGES
# ======================================================

NORMAL = {

    "Temperature": (20,24),

    "Humidity": (40,60),

    "Pressure": (5,15),

    "ACH": (20,25),

    "CO2": (400,800),

    "PM25": (0,12),

    "PM10": (0,50),

    "TVOC": (50,300),

    "Airflow": (0.20,0.30),

    "Light": (1000,1600),

    "Noise": (40,60)

}

# ======================================================
# ABNORMAL RANGES
# ======================================================

ABNORMAL = {

    "Temperature": (25,30),

    "Humidity": (61,75),

    "Pressure": (0,4),

    "ACH": (10,19),

    "CO2": (801,1200),

    "PM25": (13,40),

    "PM10": (51,120),

    "TVOC": (301,700),

    "Airflow": (0.05,0.19),

    "Light": (600,999),

    "Noise": (61,85)

}

# ======================================================
# EMPTY LISTS
# ======================================================

temperature = []
humidity = []
pressure = []
ach = []
co2 = []
pm25 = []
pm10 = []
tvoc = []
airflow = []
light = []
noise = []

# ======================================================
# HELPER FUNCTIONS
# ======================================================

def normal_value(parameter):

    low, high = NORMAL[parameter]

    if isinstance(low, int) and isinstance(high, int):

        return random.randint(low, high)

    return round(random.uniform(low, high), 1)


def abnormal_value(parameter):

    low, high = ABNORMAL[parameter]

    if isinstance(low, int) and isinstance(high, int):

        return random.randint(low, high)

    return round(random.uniform(low, high), 1)

# ======================================================
# GENERATE DATA
# ======================================================

for _ in range(TOTAL_ROWS):

    # -------------------------
    # Generate Normal Values
    # -------------------------

    temp = normal_value("Temperature")
    hum = normal_value("Humidity")
    pres = normal_value("Pressure")
    ach_val = normal_value("ACH")
    co2_val = normal_value("CO2")
    pm25_val = normal_value("PM25")
    pm10_val = normal_value("PM10")
    tvoc_val = normal_value("TVOC")
    airflow_val = normal_value("Airflow")
    light_val = normal_value("Light")
    noise_val = normal_value("Noise")

    # -------------------------
    # 15% Chance of Fault
    # -------------------------

    if random.random() < ABNORMAL_PERCENTAGE:

        fault = random.choice([
            "HVAC",
            "VENTILATION",
            "AIR_QUALITY",
            "CHEMICAL",
            "LIGHTING",
            "NOISE"
        ])

        # HVAC Failure
        if fault == "HVAC":

            temp = abnormal_value("Temperature")
            hum = abnormal_value("Humidity")
            airflow_val = abnormal_value("Airflow")

        # Ventilation Failure
        elif fault == "VENTILATION":

            pres = abnormal_value("Pressure")
            ach_val = abnormal_value("ACH")
            co2_val = abnormal_value("CO2")

        # Air Quality Failure
        elif fault == "AIR_QUALITY":

            pm25_val = abnormal_value("PM25")
            pm10_val = abnormal_value("PM10")

        # Chemical Exposure
        elif fault == "CHEMICAL":

            tvoc_val = abnormal_value("TVOC")

        # Lighting Failure
        elif fault == "LIGHTING":

            light_val = abnormal_value("Light")

        # Equipment Noise
        elif fault == "NOISE":

            noise_val = abnormal_value("Noise")

    # -------------------------
    # Save Values
    # -------------------------

    temperature.append(temp)
    humidity.append(hum)
    pressure.append(pres)
    ach.append(ach_val)
    co2.append(co2_val)
    pm25.append(pm25_val)
    pm10.append(pm10_val)
    tvoc.append(tvoc_val)
    airflow.append(airflow_val)
    light.append(light_val)
    noise.append(noise_val)
# ======================================================
# CREATE DATAFRAME
# ======================================================

df = pd.DataFrame({
    "Timestamp": timestamps,
    "Temperature": temperature,
    "Humidity": humidity,
    "Differential_Pressure": pressure,
    "ACH": ach,
    "CO2": co2,
    "PM2.5": pm25,
    "PM10": pm10,
    "TVOC": tvoc,
    "Airflow_Velocity": airflow,
    "Light_Intensity": light,
    "Noise_Level": noise
})

# ======================================================
# ROUND DECIMAL VALUES
# ======================================================

df["Temperature"] = df["Temperature"].round(1)
df["Humidity"] = df["Humidity"].round(1)
df["Differential_Pressure"] = df["Differential_Pressure"].round(1)
df["PM2.5"] = df["PM2.5"].round(1)
df["PM10"] = df["PM10"].round(1)
df["Airflow_Velocity"] = df["Airflow_Velocity"].round(2)

# ======================================================
# SAVE DATASET
# ======================================================

import os

OUTPUT_FILE = os.path.join(
    os.path.dirname(__file__),
    "ot_environment.csv"
)

df.to_csv(OUTPUT_FILE, index=False)
# ======================================================
# DISPLAY RESULT
# ======================================================

print("\n===============================================")
print(" OT ENVIRONMENT DATASET GENERATED SUCCESSFULLY ")
print("===============================================\n")

print(f"Total Rows    : {len(df)}")
print(f"Total Columns : {len(df.columns)}")

print("\nColumns:")
print(df.columns.tolist())

print("\nFirst 10 Records:\n")
print(df.head(10))

print("\nLast 10 Records:\n")
print(df.tail(10))

import os

print("\nDataset saved successfully!")
print("Location:", os.path.abspath(OUTPUT_FILE))