from flask import Blueprint, render_template, redirect, url_for, session
from page.auth import login_required
settings_bp = Blueprint('settings',__name__)

@settings_bp.route('/settings')
@login_required
def settings():
    return render_template('settings.html')

@settings_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    session.clear()
    return redirect(url_for('login'))