import pandas as pd
import numpy as np
import random

# -----------------------------
# Configuration
# -----------------------------
NUM_RECORDS = 8640

timestamps = pd.date_range(
    start="2026-01-01",
    periods=NUM_RECORDS,
    freq="5min"
)

surgery_types = [
    "General Surgery",
    "Cardiac Surgery",
    "Neurosurgery",
    "Orthopedic Surgery"
]

# Create DataFrame
df = pd.DataFrame()

df["Timestamp"] = timestamps

# Randomly assign surgery type
df["Surgery_Type"] = [
    random.choice(surgery_types)
    for _ in range(NUM_RECORDS)
]
# ---------------------------------
# Decide whether OT is Good or Bad
# ---------------------------------

environment_type = []

for _ in range(NUM_RECORDS):
    if random.random() < 0.5:
        environment_type.append("Good")
    else:
        environment_type.append("Bad")

df["Environment_Type"] = environment_type
print(df.head())
print(df["Environment_Type"].value_counts())
