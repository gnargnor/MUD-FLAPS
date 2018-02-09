from datetime import datetime
from app import db, login
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

@login.user_loader
def load_user(id):
    return User.query.get(int(id))

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    worlds = db.relationship('World', backref='creator', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        if self.password_hash is not None:
            return check_password_hash(self.password_hash, password)
        return False

    def __repr__(self):
        return '<User {0} id {1}>'.format(self.username, self.id)

class World(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    _locations = db.relationship('Location', backref='world', lazy='dynamic')
    _items = db.relationship('Item', backref='world', lazy='dynamic')
    date_created = db.Column(db.DateTime, index=True)
    name = db.Column(db.String(128), unique=True, index=True)
    desc = db.Column(db.String)
    game_count = db.Column(db.Integer)
    active = db.Column(db.Boolean, default=False, index=True)

    def __init__(self, name, desc, creator_id):
        self.name = name
        self.desc = desc
        self.creator_id = creator_id
        self.date_created = datetime.now()

    def serialize(self):
        return {
            '_id': self.id,
            'worldName': self.name,
            'worldDesc': self.desc,
            'author': ''
        }
        
    # def add_location(self, location):
    #     print('add location to world {0}'.format(location))
    #     print('current locations: {0}'.format(_locations))

    # def add_item(self, item):
    #     print('add item to world: {0}'.format(item))
    #     print('current items: {0}'.format(_items))

    def __repr__(self):
        return '<World {0} id {1}>'.format(self.name, self.id)

class Location(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    world_id = db.Column(db.Integer, db.ForeignKey('world.id'))
    # _items = db.relationship('Item', backref='item_location', lazy='dynamic')
    # _exits = db.relationship('Exit', backref='exit_location', lazy='dynamic')
    date_created = db.Column(db.DateTime, index=True)
    x = db.Column(db.Integer)
    y = db.Column(db.Integer)
    name = db.Column(db.String(128), unique=True, index=True)
    desc = db.Column(db.String)
    short_desc = db.Column(db.String)
    notes = db.Column(db.String)

    def __init__(self, world_id, name, desc, notes, creator_id):
        self.world_id = world_id
        self.date_created = datetime.now()
        self.name = name
        self.desc = desc
        self.notes = notes
        self.creator_id = creator_id
        

    def serialize(self):
        return {
            '_id': self.id,
            'locName': self.name,
            'locDesc': self.desc,
            'locNotes': self.notes
        }

    def __repr__(self):
        return '<Location {0} id {1}>'.format(self.name, self.id)


class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    world_id = db.Column(db.Integer, db.ForeignKey('world.id'))
    location_id = db.Column(db.Integer, db.ForeignKey('location.id'))
    date_created = db.Column(db.DateTime, index=True)
    name = db.Column(db.String(128), unique=True, index=True)
    desc = db.Column(db.String)
    # Targets could be items, users, etc - need parent class that each inherits from
    targets = db.Column(db.String)
    notes = db.Column(db.String)

    def __init__(self, world_id, name, desc, notes, creator_id):
        self.world_id = world_id
        # change to inventory id - create inventory class
        # self.location_id = location_id
        self.date_created = datetime.now()
        self.name = name
        self.desc = desc
        self.notes = notes
        self.creator_id = creator_id

    def serialize(self):
        return {
            '_id': self.id,
            'itemName': self.name,
            'itemDesc': self.desc,
            'itemNotes': self.notes
        }

    def __repr__(self):
        return '<Item {0} id {1)>'.format(self.name, self.id)

class Sight(db.Model):
    # Could this be a dict that lives in things that are looked at?
    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    # world_id = db.Column(db.Integer, db.ForeignKey('world.id'))
    location_id = db.Column(db.Integer, db.ForeignKey('location.id'))
    date_created = db.Column(db.DateTime, index=True)
    name = db.Column(db.String(128), index=True)
    desc = db.Column(db.String)
    important = db.Column(db.Boolean)

    def __init__(self, location_id, name, desc, important, creator_id):
        self.world_id = world_id
        self.location_id = location_id
        self.date_created = datetime.now()
        self.name = name
        self.desc = desc
        self.important = important
        self.creator_id = creator_id

    def serialize(self):
        return {
            '_id': self.id,
            'keyword': self.name,
            'sightDesc': self.desc,
            'isImportant': self.important
        }

    def __repr__(self):
        return '<Sight {0} id{1}>'.format(self.name, self.id)

# Change to door
class Exit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    world_id = db.Column(db.Integer, db.ForeignKey('world.id'))
    location_id = db.Column(db.Integer, db.ForeignKey('location.id'))
    dest_loc_id = db.Column(db.Integer, db.ForeignKey('location.id')) 
    date_created = db.Column(db.DateTime, index=True)
    desc = db.Column(db.String(128))
    direction = db.Column(db.String)
    is_open = db.Column(db.Boolean)
    is_unlocked = db.Column(db.Boolean)

    def __init__(self, location_id, desc, direction, is_open, is_unlocked, creator_id):
        self.location_id = location_id
        self.desc = desc
        self.direction = direction
        self.is_open = is_open
        self.is_unlocked = is_unlocked
        self.creator_id = creator_id

    def serialize(self):
        return {
            '_id': self.id,
            'exitDir': self.direction,
            'exitDesc': self.desc,
            '_destLoc': self.dest_loc,
            'open': self.is_open,
            'unlocked': self.is_unlocked
        }

    def __repr__(self):
        return '<Exit {0} id{1}>'.format(self.description, self.id)

# TODO add attributes for items?  figure out whether attributes/sights can be reconciled
# attributes/sights will probably apply to characters, items, locations, etc
# perhaps use subclasses??










