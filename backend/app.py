from flask import Flask, render_template, request, redirect, url_for, session
from flask import jsonify, make_response, Response   
from page.models import db, AllowedUser 
from flask_cors import CORS
import json
import os
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta

# ✅ Create Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
app.secret_key = 'secret123'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# ✅ Setup DB
db.init_app(app)

# ✅ Import blueprints AFTER app is created
from page.collider import collider_bp
from page.register import register_bp
from page.reports import reports_bp
from page.settings import settings_bp
from page.management import management_bp

# ✅ Register blueprints
app.register_blueprint(collider_bp)
app.register_blueprint(register_bp)
app.register_blueprint(reports_bp)
app.register_blueprint(settings_bp)
app.register_blueprint(management_bp)

# ✅ API ROUTES
@app.route('/api/ph')
def get_ph():
    with open("ph_data.json") as f:
        data = json.load(f)
    return jsonify(data)    

@app.route('/api/distance')
def get_distance():
    with open("ultrasonic_data.json") as f:
        data = json.load(f)
    return jsonify(data)

@app.route('/api/color')
def get_color():
    try:
        with open('color_data.json') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ LOGIN & LOGOUT
@app.route('/', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = AllowedUser.query.filter_by(email=email).first()
    if user and user.password == password:
        session['user'] = user.email
        return jsonify({'success': True})
    return jsonify({'success': False}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({'message': 'Logged out'}), 200

@app.route('/api/export/xml', methods=['GET'])
def export_xml():
    try:
        with open("esp_data.json", "r") as f:
            data = json.load(f)

        root = ET.Element("SensorData")
        for entry in data:
            record = ET.SubElement(root, "Record")
            for key, value in entry.items():
                child = ET.SubElement(record, key)
                child.text = str(value)

        xml_data = ET.tostring(root, encoding='utf-8', method='xml')
        response = Response(xml_data, mimetype='application/xml')
        response.headers['Content-Disposition'] = 'attachment; filename=esp_data.xml'
        return response

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ RECEIVING ESP DATA — NOW APPENDS INSTEAD OF OVERWRITES
@app.route('/api/data', methods=['POST'])
def receive_data():
    try:
        data = request.get_json()
        now = datetime.now()
        data['timestamp'] = now.isoformat()

        group_file = "esp_groups.json"

        if os.path.exists(group_file):
            with open(group_file, "r") as f:
                try:
                    groups = json.load(f)
                except json.JSONDecodeError:
                    groups = []
        else:
            groups = []

        if not groups:
            new_group = {
                "id": 1,
                "start_time": now.isoformat(),
                "end_time": (now + timedelta(minutes=10)).isoformat(),
                "records": [data]
            }
            groups.append(new_group)
        else:
            last_group = groups[-1]
            group_end = datetime.fromisoformat(last_group["end_time"])

            if now < group_end:
                last_group["records"].append(data)
            else:
                new_group = {
                    "id": last_group["id"] + 1,
                    "start_time": now.isoformat(),
                    "end_time": (now + timedelta(minutes=10)).isoformat(),
                    "records": [data]
                }
                groups.append(new_group)

        with open(group_file, "w") as f:
            json.dump(groups, f, indent=2)

        return jsonify({"status": "grouped"}), 200

    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"error": "Invalid data"}), 400

@app.route('/api/groups', methods=['GET'])
def get_grouped_data():
    try:
        with open("esp_groups.json", "r") as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/export/xml/<int:group_id>', methods=['GET'])
def export_xml_group(group_id):
    try:
        with open("esp_groups.json", "r") as f:
            groups = json.load(f)

        group = next((g for g in groups if g["id"] == group_id), None)
        if not group:
            return jsonify({"error": "Group not found"}), 404

        root = ET.Element("SensorGroup")
        ET.SubElement(root, "GroupID").text = str(group["id"])
        ET.SubElement(root, "StartTime").text = group["start_time"]
        ET.SubElement(root, "EndTime").text = group["end_time"]

        records_elem = ET.SubElement(root, "Records")
        for record in group["records"]:
            record_elem = ET.SubElement(records_elem, "Record")
            ET.SubElement(record_elem, "ph").text = str(record.get("pH", ""))
            ET.SubElement(record_elem, "turbidity").text = str(record.get("Turbidity", ""))
            ET.SubElement(record_elem, "Flow").text = str(record.get("Flow", ""))
            ET.SubElement(record_elem, "water_level").text = str(record.get("WaterLevel", ""))
            color = record.get("Color", [])
            color_text = ", ".join(map(str, color)) if isinstance(color, list) else str(color)
            ET.SubElement(record_elem, "color").text = color_text
            ET.SubElement(record_elem, "Timestamp").text = record.get("timestamp", "")

        xml_data = ET.tostring(root, encoding='utf-8')
        from xml.dom import minidom
        pretty_xml = minidom.parseString(xml_data).toprettyxml(indent="  ")

        response = Response(pretty_xml, mimetype='application/xml')
        response.headers['Content-Disposition'] = f'attachment; filename=group_{group_id}.xml'
        return response

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ RETURN LATEST RECORD FROM LATEST GROUP
@app.route('/api/esp', methods=['GET'])
def get_esp_data():
    try:
        with open('esp_groups.json') as f:
            groups = json.load(f)

        if not groups:
            return jsonify({"error": "No data available"}), 404

        latest_group = groups[-1]
        records = latest_group.get("records", [])

        if not records:
            return jsonify({"error": "No records in latest group"}), 404

        return jsonify(records[-1])  # Return the latest record from the latest group

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Run App
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
