# page/register.py

from flask import Blueprint, render_template, request
from page.models import db, AllowedUser  # ✅ now from models, not app

register_bp = Blueprint('register', __name__)



@register_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        existing_user = AllowedUser.query.filter_by(email=email).first()
        if existing_user:
            return "❌ Email already registered."

        new_user = AllowedUser(email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
        return "✅ Registration successful! You can now log in."

    return render_template("register.html")
