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

    def __repr__(self):
        return '<World {0} id {1}>'.format(self.name, self.id)

class Location(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    world_id = db.Column(db.Integer, db.ForeignKey('world.id'))
    _items = db.relationship('Item', backref='location', lazy='dynamic')
    _exits = db.relationship('Exit', backref='location', lazy='dynamic')
    date_created = db.Column(db.DateTime, index=True)
    x = db.Column(db.Integer)
    y = db.Column(db.Integer)
    name = db.Column(db.String(128), unique=True, index=True)
    description = db.Column(db.String)
    short_description = db.Column(db.String)
    notes = db.Column(db.String)

    def __repr__(self):
        return '<Location {0} id {1}>'.format(self.name, self.id)

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    world_id = db.Column(db.Integer, db.ForeignKey('world.id'))
    location_id = db.Column(db.Integer, db.ForeignKey('location.id'))
    date_created = db.Column(db.DateTime, index=True)
    name = db.Column(db.String(128), unique=True, index=True)
    description = db.Column(db.String)
    # Targets could be items, users, etc - need parent class that each inherits from
    targets = db.Column(db.String)
    notes = db.Column(db.String)

    def __repr__(self):
        return '<Item {0} id {1)>'.format(self.name, self.id)

class Sight(db.Model):
    # Could this be a dict that lives in things that are looked at?
    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    world_id = db.Column(db.Integer, db.ForeignKey('world.id'))
    location_id = db.Column(db.Integer, db.ForeignKey('location.id'))
    date_created = db.Column(db.DateTime, index=True)
    name = db.Column(db.String(128), index=True)
    description = db.Column(db.String)
    important = db.Column(db.Boolean)

    def __repr__(self):
        return '<Sight {0} id{1}>'.format(self.name, self.id)

class Exit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    location_id = db.Column(db.Integer, db.ForeignKey('location.id'))
    dest_loc_id = db.Column(db.Integer, db.ForeignKey('location.id')) 
    date_created = db.Column(db.DateTime, index=True)
    description = db.Column(db.String(128))
    direction = db.Column(db.String)
    is_open = db.Column(db.Boolean)
    is_unlocked = db.Column(db.Boolean)

    def __repr__(self):
        return '<Exit {0} id{1}>'.format(self.description, self.id)










