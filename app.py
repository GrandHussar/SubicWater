from flask import Flask, render_template, request, redirect, url_for, session
from page.models import db, AllowedUser 

# ✅ Create Flask app first
app = Flask(__name__)
app.secret_key = 'secret123'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# ✅ Setup DB
db.init_app(app)

# ✅ Import blueprints AFTER app is created
from page.collider import collider_bp
from page.register import register_bp

# ✅ Register blueprints
app.register_blueprint(collider_bp)
app.register_blueprint(register_bp)

from page.reports import reports_bp
app.register_blueprint(reports_bp)

from page.settings import settings_bp
app.register_blueprint(settings_bp)



# ✅ User model
#class AllowedUser(db.Model):
    #id = db.Column(db.Integer, primary_key=True)
   # email = db.Column(db.String(120), unique=True, nullable=False)
    #password = db.Column(db.String(100), nullable=False)

# ✅ Login route
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        user = AllowedUser.query.filter_by(email=email).first()
        if user and user.password == password:
            session['user'] = user.email
            return redirect(url_for('collider.dashboard'))
        else:
            return "Invalid email or password 😤"

    return render_template("login.html")

# ✅ App runner
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)



