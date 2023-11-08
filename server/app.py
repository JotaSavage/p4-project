from flask import Flask, request, make_response, jsonify, session
from flask_restful import Resource, Api
from models import db, User, News, Favorite
from flask_migrate import Migrate
import os
from flask_cors import CORS


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

CORS(app)
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
        return new.to_dict(), 200
    

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

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    new_user = User(username=data['username'])
    new_user.password_hash = data['password']
    db.session.add(new_user)
    db.session.commit()

    return {'message': 'user added'}, 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter(User.username == data['username']).first()

    if not user:
        return {'message': 'user not found'}, 404
    
    if user.authenticate(data['password']):
        # passwords matched, add cookie
        session['user_id'] = user.id
        return {'message': 'login success'}, 201
    else:
        # password did not match, send error resp
        return {'message': 'login failed'}, 401
    

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
    # delete cookie
    session.pop('user_id')
    return {'message': 'logged out'}, 200

if __name__ == '__main__':
    app.run(port=5555, debug=True)
    
        
