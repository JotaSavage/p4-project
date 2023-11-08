from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from flask_bcrypt import Bcrypt
from sqlalchemy.ext.hybrid import hybrid_property


metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
bcrypt = Bcrypt()


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-new.user',)
    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String, nullable=False)
    _password_hash = db.Column(db.String)

    new = db.relationship('News', back_populates='user')

    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, new_pass):
        pass_hash = bcrypt.generate_password_hash(new_pass.encode('utf-8'))
        self._password_hash = pass_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, 
            password.encode('utf-8')
        )


class News(db.Model, SerializerMixin):
    __tablename__ = 'news'
    serialize_rules = ('-favorite.new', '-user.new')

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    date_published = db.Column(db.DateTime)
    author = db.Column(db.String)
    content = db.Column(db.String)
    article_image = db.Column(db.String)
    publishing_organization = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    favorite_id = db.Column(db.Integer, db.ForeignKey('favorites.id'))

    favorite = db.relationship('Favorite', back_populates='new')
    user = db.relationship('User', back_populates='new')


class Favorite(db.Model, SerializerMixin):
    __tablename__ =  'favorites'

    serialize_rules = ('-new.favorite',)
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    new = db.relationship('News', back_populates='favorite')




