import os, re
from flask import Flask, request, jsonify, redirect
from flask_sqlalchemy import SQLAlchemy
import urllib.request
from sqlalchemy import create_engine
from sqlalchemy_utils import database_exists, create_database
import utils

# Create a Flask app instance
# allow for cross-origin resource sharing
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# Initialize the database
basedir = os.path.abspath(os.path.dirname(__file__))
SQLITE_URI = 'sqlite:///' + os.path.join(basedir, 'data.sqlite')
engine = create_engine(SQLITE_URI)
if not database_exists(engine.url):
    create_database(engine.url)

app.config['SQLALCHEMY_DATABASE_URI'] = SQLITE_URI

# Integrates SQLAlchemy with Flask
db = SQLAlchemy(app)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), nullable=False)
    password = db.Column(db.Text, nullable=False)

    def __init__(self, username, password):
        self.username = username
        self.password = password

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=True)
    recording_url = db.Column(db.Text, nullable=True)

    def __init__(self, title, content):
        self.title = title
        self.content = content

with app.app_context():
    db.create_all()


def decode_params(params):
    return params

@app.route('/register', methods=['POST'])
def route_register():
    if request.method == 'POST':
        username = request.json['username']
        password = request.json['password']
        if username is None or password is None:
            return jsonify({'status': 'error', 'message': 'username or password is missing', 'code': 400}), 400
        if User.query.filter_by(username=username).first() is not None:
            return jsonify({'status': 'error', 'message': 'username already exists', 'code': 400}), 400
        password = utils.create_credentials(username, password)
        if password is None:
            return jsonify({'status': 'error', 'message': 'password not valid', 'code': 400}), 400
        new_user = User(username, password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'status': 'success', 'message': 'user created successfully', 'username': username,'code': 200}), 200

@app.route('/login', methods=['POST'])
def route_login():
    if request.method == 'POST':
        username = request.json['username']
        password = request.json['password']
        if username is None or password is None:
            return jsonify({'status': 'error', 'message': 'username or password is missing', 'code': 400}), 400
        user = User.query.filter_by(username=username).first()
        if user is None:
            return jsonify({'status': 'error', 'message': 'username does not exist', 'code': 400}), 400
        current_credentials = utils.create_credentials(username, password)
        if current_credentials is None:
            return jsonify({'status': 'error', 'message': 'password not valid', 'code': 400}), 400
        if current_credentials != user.password:
            return jsonify({'status': 'error', 'message': 'password is incorrect', 'code': 400}), 400
        token = utils.generate_token(username)
        return jsonify({'status': 'success', 'message': 'login successful', 'username': username, 'code': 200, 'token': token}), 200

@app.route('/question', methods=['POST', 'GET', 'PUT', 'DELETE'])
def route_question():

    if request.method == 'POST':
        title = request.json['title']
        content = request.json['content']
        if title is None or content is None:
            return jsonify({'status': 'error', 'message': 'title or content is missing', 'code': 400}), 400
        new_question = Question(title, content)
        db.session.add(new_question)
        db.session.commit()
        return jsonify({'status': 'success', 'message': 'question created successfully', 'code': 200}), 200

    # pagination
    elif request.method == 'GET':
        page = request.args.get('page', 1, type=int)
        params = request.args.get('params', None, type=str)
        prompt = request.args.get('prompt', None, type=str)
        condition = decode_params(params)
        if page is None:
            return jsonify({'status': 'error', 'message': 'page is missing', 'code': 400}), 400
        if condition is not None:
            # query question if params exist in question's title or content
            questions = Question.query.filter(Question.title.like('%' + condition + '%') | Question.content.like('%' + condition + '%')).paginate(page=page, per_page=10)
            # questions = Question.query.filter().paginate(page=page, per_page=10)
        else:
            questions = Question.query.paginate(page=page, per_page=10)
        # serialize the query result questions.items
        items = []
        for question in questions.items:
            items.append({
                'id': question.id,
                'title': question.title,
                'content': question.content,
                'answer': question.answer,
                'recording_url': question.recording_url
            })
        if prompt is not None:
            # only return string of recording_url
            if len(items) == 0:
                return "sorry, no result", 400
            else:
                # Create a VXML response with the recording URL
                # vxml_response = f'<?xml version="1.0"?><vxml version="2.1"><form><block><audio src="{items[0]["recording_url"]}"/></block></form></vxml>'
                vxml_response = """
                    <?xml version="1.0" ?>
                    <vxml version="2.1" xml:lang="en-US">
                        <form>
                            <block>
                                
                                <prompt>{}</prompt>
                            </block>
                        </form>
                    </vxml>
                    """.format(items[0]["answer"])
                return vxml_response, 200
        return jsonify({'status': 'success', 'message': 'questions retrieved successfully', 'code': 200, 'questions': items}), 200

    elif request.method == 'PUT':
        id = request.json['id']
        answer = request.json['answer']
        recording_url = request.json['recording_url']
        if id is None:
            return jsonify({'status': 'error', 'message': 'id is missing', 'code': 400}), 400
        if answer is None and recording_url is None:
            return jsonify({'status': 'error', 'message': 'answer and recording_url are missing', 'code': 400}), 400
        question = Question.query.filter_by(id=id).first()
        if question is None:
            return jsonify({'status': 'error', 'message': 'question does not exist', 'code': 400}), 400
        if answer is not None:
            question.answer = answer
        if recording_url is not None:
            question.recording_url = recording_url
        db.session.commit()
        return jsonify({'status': 'success', 'message': 'question updated successfully', 'code': 200}), 200

    elif request.method == 'DELETE':
        id = request.json['id']
        if id is None:
            return jsonify({'status': 'error', 'message': 'id is missing', 'code': 400}), 400
        question = Question.query.filter_by(id=id).first()
        if question is None:
            return jsonify({'status': 'error', 'message': 'question does not exist', 'code': 400}), 400
        db.session.delete(question)
        db.session.commit()
        return jsonify({'status': 'success', 'message': 'question deleted successfully', 'code': 200}), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=4000, debug=True)