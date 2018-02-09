from app import app, db
from flask import request, redirect, url_for, send_from_directory, current_app, jsonify
from werkzeug.security import generate_password_hash
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User, World, Location, Item, Sight, Exit
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
        print(current_user.id)
        # this is where we send the user data, for now
        return jsonify({'username': current_user.username, '_id': current_user.id})
    return 'no juice - not authenticated'


@app.route('/user/logout')
@login_required
def logout():
    '''logs out current user'''
    logout_user()
    return jsonify({'username': None})
    # right now client doesn't expect anything, but it should be able to detect a 200 / 400 response and react accordingly


@app.route('/world', methods=['GET', 'POST'])
@login_required
def world():
    if request.method == 'GET':
        worlds = [world.serialize() for world in list(World.query.filter_by(creator_id=current_user.id).all())]
        return jsonify(worlds)

    if request.method == 'POST':
        print('world post route: ', request.get_json())
        data = request.get_json()
        world_name, world_desc = pluck(data, 'worldName', 'worldDesc')
        world = World(name=world_name, desc=world_desc, creator_id=current_user.id)
        db.session.add(world)
        db.session.commit()
        new_world = World.query.filter_by(name=world_name, creator_id=current_user.id).first()
        if new_world:
            print('new world!')
            return jsonify(new_world.serialize())
        return 'error saving world (lol)'

    
@app.route('/location', methods=['POST'])
@app.route('/location/<_world_id>', methods=['GET'])
@login_required
def location(_world_id=''):
    if request.method == 'GET':
        print('world id: {}'.format(_world_id))
        print([location.serialize() for location in list(Location.query.filter_by(world_id=_world_id).all())])
        return jsonify([location.serialize() for location in list(Location.query.filter_by(world_id=_world_id).all())])

    if request.method == 'POST':
        print('post route: ', request.get_json())
        data = request.get_json()
        loc_name, loc_desc, world_id, loc_notes = pluck(data, 'locName', 'locDesc', '_world', 'locNotes')
        location = Location(
            world_id=world_id,
            creator_id=current_user.id,
            name=loc_name,
            desc=loc_desc,
            notes=loc_notes
        )
        db.session.add(location)
        db.session.commit()
        new_location = Location.query.filter_by(name=loc_name, creator_id=current_user.id).first()
        if new_location:
            print('new location!')
            return jsonify(new_location.serialize())
        return 'error saving location'


@app.route('/item', methods=['POST'])
@app.route('/item/<_world_id>', methods=['GET'])
@login_required
def item(_world_id=''):
    if request.method == 'GET':  
        print('world id: {}'.format(_world_id))
        print([item.serialize() for item in list(Item.query.filter_by(world_id=_world_id).all())])
        return jsonify([item.serialize() for item in list(Item.query.filter_by(world_id=_world_id).all())])

    if request.method == 'POST':
        print('post route: ', request.get_json())
        data = request.get_json()
        item_name, item_desc, item_notes, world_id = pluck(data, 'itemName', 'itemDesc', 'itemNotes', '_world')
        item = Item(
            world_id=world_id,
            name=item_name,
            desc=item_desc,
            notes=item_notes,
            creator_id=current_user.id
        )
        db.session.add(item)
        db.session.commit()
        new_item = Item.query.filter_by(name=item_name, creator_id=current_user.id).first()
        if new_item:
            print('new item!')
            return jsonify(new_item.serialize())
        return 'error saving item'

@app.route('/sight', methods=['POST'])
@app.route('/sight/<_location_id>', methods=['GET'])
@login_required
def sight(_location_id=''):
    if request.method == 'GET':  
        print('loc id: {}'.format(_location_id))
        print([sight.serialize() for sight in list(Sight.query.filter_by(location_id=_location_id).all())])
        return jsonify([sight.serialize() for sight in list(Sight.query.filter_by(location_id=_location_id).all())])

    if request.method == 'POST':
        print('post route: ', request.get_json())
        data = request.get_json()
        keyword, sight_desc, important, location_id = pluck(data, 'keyword', 'sightDesc', 'isImportant', '_location')
        sight = Sight(
            location_id=_location,
            keyword=keyword,
            desc=sight_desc,
            important=important,
            creator_id=current_user.id
        )
        db.session.add(sight)
        db.session.commit()
        new_sight = Sight.query.filter_by(keyword=keyword, location_id=location_id, creator_id=current_user.id).first()
        if new_sight:
            print('new sight!')
            return jsonify(new_sight.serialize())
        return 'error saving sight'

# Change to door
@app.route('/exit', methods=['POST'])
@app.route('/exit/<_location_id>', methods=['GET'])
@login_required
def exit(_location_id=''):
    if request.method == 'GET':  
        print('location id: {}'.format(_location_id))
        print([door.serialize() for door in list(Exit.query.filter_by(location_id=_location_id).all())])
        return jsonify([door.serialize() for door in list(Exit.query.filter_by(world_id=_world_id).all())])

    if request.method == 'POST':
        print('post route: ', request.get_json())
        data = request.get_json()
        exit_dir, exit_desc, is_open, is_unlocked, location_id = pluck(data, 'exitDir', 'exitDesc', 'open', 'unlocked', '_location')
        door = Exit(
            location_id=world_id,
            direction=exit_dir,
            desc=exit_desc,
            is_open=is_open,
            is_unlocked=is_unlocked,
            creator_id=current_user.id
        )
        db.session.add(door)
        db.session.commit()
        new_door = Exit.query.filter_by(desc=exit_desc, creator_id=current_user.id).first()
        if new_door:
            print('new exit!')
            return jsonify(new_door.serialize())
        return 'error saving exit'
    



        


