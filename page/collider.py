from flask import Blueprint, render_template
from functools import wraps
from flask import redirect, url_for, session
from flask import make_response
from page.auth import login_required


collider_bp = Blueprint('collider', __name__)

@collider_bp.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')




