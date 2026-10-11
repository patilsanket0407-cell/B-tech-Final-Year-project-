import streamlit as st
import json
import os

st.set_page_config(
    page_title="OT Control Panel",
    page_icon="🏥",
    layout="wide"
)

FILE_NAME = "current_values.json"

# -----------------------------
# Create JSON file if it doesn't exist
# -----------------------------
if not os.path.exists(FILE_NAME):

    default_data = {
        "Mode": "AUTO",

        "Surgery_Type": "General Surgery",
        "Temperature": 22,
        "Humidity": 50,
        "Differential_Pressure": 20,
        "ACH": 25,
        "CO2": 550,
        "PM2.5": 5,
        "PM10": 15,
        "TVOC": 150,
        "Airflow_Velocity": 0.25,
        "Light_Intensity": 1100,
        "Noise_Level": 45
    }

    with open(FILE_NAME, "w") as f:
        json.dump(default_data, f, indent=4)

# -----------------------------
# Read current values
# -----------------------------
with open(FILE_NAME, "r") as f:
    data = json.load(f)

mode = st.radio(
    "Data Source",
    ["AUTO", "MANUAL"],
    index=0 if data.get("Mode", "AUTO") == "AUTO" else 1
)
st.title("🏥 OT Environment Control Panel")

st.write("Change the OT environment values below and click **Update Values**.")

surgery = st.selectbox(
    "Surgery Type",
    [
        "General Surgery",
        "Cardiac Surgery",
        "Neurosurgery",
        "Orthopedic Surgery"
    ],
    index=[
        "General Surgery",
        "Cardiac Surgery",
        "Neurosurgery",
        "Orthopedic Surgery"
    ].index(data["Surgery_Type"])
)

col1, col2 = st.columns(2)

with col1:

    temperature = st.number_input(
        "Temperature (°C)",
        value=float(data["Temperature"])
    )

    humidity = st.number_input(
        "Humidity (%)",
        value=int(data["Humidity"])
    )

    pressure = st.number_input(
        "Differential Pressure (Pa)",
        value=int(data["Differential_Pressure"])
    )

    ach = st.number_input(
        "ACH",
        value=int(data["ACH"])
    )

    airflow = st.number_input(
        "Airflow Velocity",
        value=float(data["Airflow_Velocity"])
    )

with col2:

    co2 = st.number_input(
        "CO₂ (ppm)",
        value=int(data["CO2"])
    )

    pm25 = st.number_input(
        "PM2.5",
        value=int(data["PM2.5"])
    )

    pm10 = st.number_input(
        "PM10",
        value=int(data["PM10"])
    )

    tvoc = st.number_input(
        "TVOC",
        value=int(data["TVOC"])
    )

    light = st.number_input(
        "Light Intensity",
        value=int(data["Light_Intensity"])
    )

    noise = st.number_input(
        "Noise Level",
        value=int(data["Noise_Level"])
    )

if st.button("✅ Update Values"):

    new_data = {
        "Mode": mode,

        "Surgery_Type": surgery,
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

    }

    with open(FILE_NAME, "w") as f:
        json.dump(new_data, f, indent=4)

    st.success("✅ Values updated successfully!")