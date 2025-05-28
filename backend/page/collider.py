from flask import Blueprint, render_template
from functools import wraps
from flask import redirect, url_for, session
from flask import make_response
from page.auth import login_required
from flask import jsonify
import os, json



collider_bp = Blueprint('collider', __name__)

@collider_bp.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

@collider_bp.route('/api/ph')
def get_ph_data():
    try:
        with open('ph_data.json') as f:
            data = json.load(f)
            return jsonify(data)
    except:
        return jsonify({"ph": "--", "timestamp": 0})




