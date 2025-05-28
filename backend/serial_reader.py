# serial_reader.py
import serial, json, time

ser = serial.Serial('COM6', 115200)  # change COM3 to your Pico port

while True:
    line = ser.readline().decode().strip()
    if line:
        try:
            ph, ts = line.split(',')
            data = {"ph": float(ph), "timestamp": int(ts)}
            with open('ph_data.json', 'w') as f:
                json.dump(data, f)
        except:
            continue
