import serial
import json
import time

ser = serial.Serial('COM6', 9600)  # Match Arduino's baud rate
time.sleep(2)

while True:
    try:
        line = ser.readline().decode().strip()
        if "pH:" in line:
            # Smart split: get text after "pH:" only
            parts = line.split("pH:")
            if len(parts) == 2:
                ph_value = float(parts[1].strip())
                data = {
                    "ph": ph_value,
                    "timestamp": int(time.time())
                }
                with open("ph_data.json", "w") as f:
                    json.dump(data, f)
                print(data)
    except Exception as e:
        print("Error:", e)
