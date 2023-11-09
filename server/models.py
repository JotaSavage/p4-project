from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.ext.hybrid import hybrid_property
import hashlib, binascii
import os

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-new.user',)
    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String, nullable=False)
    _password_hash = db.Column(db.String)

    # Maintain the favorites relationship in the User model
    favorites = db.relationship('Favorite', back_populates='user')
    new = db.relationship('News', back_populates='user')

    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, new_pass):
        salt = os.urandom(16)
        pass_hash = hashlib.scrypt(
            new_pass.encode('utf-8'), 
            salt=salt, 
            n=16384, 
            r=8, 
            p=1, 
            dklen=64
        )
        self._password_hash = binascii.hexlify(salt + pass_hash).decode('utf-8')

    def authenticate(self, password):
        salt_and_hash = binascii.unhexlify(self._password_hash)
        salt = salt_and_hash[:16]
        stored_pass_hash = salt_and_hash[16:]
        pass_hash = hashlib.scrypt(
            password.encode('utf-8'), 
            salt=salt, 
            n=16384, 
            r=8, 
            p=1, 
            dklen=64
        )
        return pass_hash == stored_pass_hash

class News(db.Model, SerializerMixin):
    __tablename__ = 'news'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    date_published = db.Column(db.DateTime, nullable=False)
    author = db.Column(db.String(100))
    content = db.Column(db.Text, nullable=False)
    article_image = db.Column(db.String(255))
    publishing_organization = db.Column(db.String(100))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))  # Add this line

    user = db.relationship('User', back_populates='new')\
    # Establish a relationship with the 'Favorite' model
    favorites = db.relationship('Favorite', back_populates='news')

class Favorite(db.Model, SerializerMixin):
    __tablename__ = 'favorites'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    news_id = db.Column(db.Integer, db.ForeignKey('news.id'), nullable=False)

    user = db.relationship('User', back_populates='favorites')
    news = db.relationship('News', back_populates='favorites')
