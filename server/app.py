from flask import Flask, request, make_response, jsonify, session
from flask_restful import Resource, Api
from models import db, User, News, Favorite
from flask_migrate import Migrate
import os
from flask_cors import CORS
from flask_bcrypt import bcrypt
import logging


app = Flask(__name__)
app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'optional_default_key')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False
logging.basicConfig(level=logging.INFO)

CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5173"])
migrate = Migrate(app, db)

db.init_app(app)
api = Api(app)

# excluded_endpoints = ['login', 'signup', 'check_session', 'root']

# @app.before_request
# def check_logged_in():
#     if request.endpoint not in excluded_endpoints:
#         user_id = session.get('user_id')
#         user = User.query.filter(User.id == user_id).first()

#         if not user:
#             # invalid cookie
#             return {'message': 'invalid session'}, 401


@app.route('/')
def index():
    return ''
@app.route('/news', methods=['GET'])
def all_news():
    news = News.query.all()
    body = [n.to_dict() for n in news]
    return jsonify(body), 200

@app.route('/news/<int:id>', methods=['GET'])
def news_by_id(id):
    new = News.query.filter(News.id == id).first()

    if not new:
        return {"error": "News not found"}, 404
    if request.method == 'GET':
        return new.to_dict(rules=('-favorites',)), 200

@app.route('/news/<int:id>/favorite', methods=['POST'])
def favorite_news(id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'message': 'User not logged in'}), 401
    new = News.query.get(id)
    if not new:
        return jsonify({'message': 'News not found'}), 404
    favorite = Favorite(news_id=new.id, user_id=user_id)  # Assuming a Favorite model with news_id and user_id fields
    db.session.add(favorite)
    db.session.commit()
    return jsonify({'message': 'News favorited'}), 200

@app.route('/favorites/<int:id>', methods=['GET', 'PATCH'])
def favorites_by_id(id):
    favorite = Favorite.query.filter(Favorite.id == id).first()

    if not favorite:
        return {"error": "favorite not found"}, 404
    if request.method == 'GET':
        return favorite.to_dict(), 200
    elif request.method == 'PATCH':
        data = request.get_json()
        for field in data:
            try:
                setattr(favorite, field, data[field])
            except ValueError as e:
                return {"errors": [str(e)]}, 400
        db.session.add(favorite)
        db.session.commit()
        return favorite.to_dict(), 200

@app.route('/favorites', methods=['GET'])
def get_user_favorites():
    # Check if the user is logged in (you can use session or token-based authentication)
    user_id = session.get('user_id')  # Replace with your actual user session logic

    if not user_id:
        return jsonify({'message': 'User not logged in'}), 401

    # Query the database to get all of the user's favorite articles
    favorite_articles = Favorite.query.filter_by(user_id=user_id).all()

    # Convert favorite articles to a list of dictionaries
    favorite_articles_list = [favorite.to_dict() for favorite in favorite_articles]

    return jsonify(favorite_articles_list), 200



@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    new_user = User(username=data['username'])
    new_user.password_hash = data['password']  # This will call the setter and hash the password
    db.session.add(new_user)
    db.session.commit()
    return {'message': 'user added'}, 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Check if username and password are provided
    if not data or 'username' not in data or 'password' not in data:
        return {'message': 'username and password required'}, 400

    user = User.query.filter(User.username == data['username']).first()

    # Check if user exists
    if not user:
        return {'message': 'user not found'}, 404
    
    # Check if password matches
    if not user.authenticate(data['password']):
        return {'message': 'incorrect password'}, 401

    # If everything is okay, log in the user
    session['user_id'] = user.id
    logging.info('Session after login: %s', session)
    return {'message': 'login success'}, 200




@app.route('/check_session')
def check_session():
    user_id = session.get('user_id')
    user = User.query.filter(User.id == user_id).first()

    if not user:
        # invalid cookie
        return {'message': 'invalid session'}, 401
    
    # valid cookie
    return {'message': 'valid session'}, 200

@app.route('/logout', methods=['DELETE'])
def logout():
    session.pop('user_id', None)  # Make sure to provide the second argument to pop
    return jsonify({'message': 'logged out'}), 200


if __name__ == '__main__':
    app.run(port=5555, debug=True)
    
        
