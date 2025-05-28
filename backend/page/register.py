# page/register.py

from flask import Blueprint, render_template, request
from page.models import db, AllowedUser  # ✅ now from models, not app
from flask import request, jsonify
register_bp = Blueprint('register', __name__)



@register_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'success': False, 'message': 'Missing email or password'}), 400

    email = data['email']
    password = data['password']

    existing_user = AllowedUser.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'success': False, 'message': '❌ Email already registered'}), 409

    new_user = AllowedUser(email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'success': True, 'message': '✅ Registration successful! You can now log in.'}), 201