from app import app, db
from flask import request, redirect, url_for, send_from_directory, current_app, jsonify
from werkzeug.security import generate_password_hash
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User
from app.helpers import pluck
from app.forms import LoginForm

@app.route('/', methods=['GET', 'POST'])
@app.route('/index', methods=['GET', 'POST'])
def index():
    error = None
    if request.method == 'POST':
        data = request.get_json()
        is_admin, username, password = pluck(data, 'isAdmin', 'username', 'password')
        user = User.query.filter_by(username=username).first()
        if user is None or not user.check_password(password):
            print(password)
            return 'wrong password'
        login_user(user, remember=True)
        print(current_user.username)
        return jsonify({'username': current_user.username, 'isAdmin': False})
    print('why me')
    return current_app.send_static_file('views/index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return 'already authenticated - write my logic'
    error = None
    if request.method == 'POST':
        data = request.get_json()
        is_admin, username, password = pluck(data, 'isAdmin', 'username', 'password')
        print(User.query.filter_by(username=username).first())
        print(db)
        if User.query.filter_by(username=username).first() is not None:
            return 'user already exists'
        new_user = User(username=username)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        if User.query.filter_by(username=username).first() is not None:
            return jsonify({'username': new_user.username, 'newUser': True})
    return 'ohhhh boyyy'

@app.route('/user')
def user():
    ''' verifies client side routes - returns username if authenticated '''
    if current_user.is_authenticated:
        # this is where we send the user data, for now
        return jsonify({'username': current_user.username, '_id': current_user.id})
    return 'no juice - not authenticated'

@app.route('/user/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'username': None})
    # right now client doesn't expect anything, but it should be able to detect a 200 / 400 response and react accordingly

@app.route('/world')
@login_required
def world():
    return 'yar!'



        


