from functools import wraps

from flask import request, jsonify, current_app
import jwt
import sqlite3

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# def token_required(f):
#     @wraps(f)
#     def decorated_function(*args, **kwargs):
#         if request.method == 'OPTIONS':
#             return jsonify({}), 200
#         token = request.headers.get('Authorization')
#         if not token:
#             return jsonify({'message': 'Token is missing'}), 403
#         try:
#             data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
#             conn = get_db_connection()
#             cursor = conn.cursor()
#             cursor.execute("SELECT id, role, username FROM Users WHERE username = ?", (data['username'],))
#             user_info = cursor.fetchone()
#             if not user_info:
#                 return jsonify({'message': 'User not found'}), 404
#             data['id'] = user_info['id']
#             data['role'] = user_info['role']
#             data['username'] = user_info['username']
#             request.token_data = data
#             # Add the decoded token data to the request context
#             request.token_data = data
#         except jwt.ExpiredSignatureError:
#             return jsonify({'message': 'Token has expired'}), 403
#         except jwt.InvalidTokenError:
#             print(token)
#             return jsonify({'message': 'Token is invalid'}), 403
#         return f(*args, **kwargs)
#     return decorated_function

