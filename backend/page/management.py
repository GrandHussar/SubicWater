from flask import Blueprint, jsonify

management_bp = Blueprint('management', __name__)

@management_bp.route('/management')
def management():
    sensors = [
        {"name": "DS18B20", "type": "Temperature", "status": "Active"},
        {"name": "YF-S201", "type": "Flow Sensor", "status": "Active"},
        {"name": "PH0-14", "type": "pH Sensor", "status": "Active"},
        {"name": "Turbidity Sensor", "type": "Turbidity", "status": "Inactive"},
        {"name": "Ultrasonic Sensor", "type": "Distance", "status": "Active"},
        {"name": "Color Recognition Sensor", "type": "Color", "status": "Active"}
    ]
    return jsonify (sensors)
