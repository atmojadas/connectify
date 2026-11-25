
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from sqlalchemy.exc import IntegrityError

from app import db
from app.models.user import User


users_bp = Blueprint("users", __name__)


# CREATE USER
@users_bp.route("/users", methods=["POST"])
def create_user():

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "status": "error",
            "message": "Request body must contain JSON"
        }), 400

    username = data.get("username", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    # Validate input
    if not username or not email or not password:
        return jsonify({
            "status": "error",
            "message": "Username, email and password are required"
        }), 400

    if len(username) > 50:
        return jsonify({
            "status": "error",
            "message": "Username must be 50 characters or fewer"
        }), 400

    if len(email) > 100 or "@" not in email:
        return jsonify({
            "status": "error",
            "message": "Please provide a valid email"
        }), 400

    if len(password) < 8:
        return jsonify({
            "status": "error",
            "message": "Password must contain at least 8 characters"
        }), 400

    # Check for existing username or email
    existing_user = User.query.filter(
        (User.username == username) |
        (User.email == email)
    ).first()

    if existing_user:
        return jsonify({
            "status": "error",
            "message": "Username or email already exists"
        }), 409

    # Hash password before storing it
    hashed_password = generate_password_hash(password)

    new_user = User(
        username=username,
        email=email,
        password_hash=hashed_password
    )

    try:
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "User registered successfully!",
            "user": {
                "id": new_user.id,
                "username": new_user.username,
                "email": new_user.email
            }
        }), 201

    except IntegrityError:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": "Username or email already exists"
        }), 409



# READ ALL USERS
@users_bp.route("/users", methods=["GET"])
def get_users():

    users = User.query.order_by(User.id.asc()).all()

    users_list = []

    for user in users:
        users_list.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "created_at": (
                user.created_at.isoformat()
                if user.created_at else None
            )
        })

    return jsonify({
        "status": "success",
        "users": users_list
    }), 200


# READ ONE USER
@users_bp.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):

    user = db.session.get(User, user_id)

    if user is None:
        return jsonify({
            "status": "error",
            "message": "User not found"
        }), 404

    return jsonify({
        "status": "success",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "created_at": (
                user.created_at.isoformat()
                if user.created_at else None
            )
        }
    }), 200



# UPDATE USER
@users_bp.route("/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):

    user = db.session.get(User, user_id)

    if user is None:
        return jsonify({
            "status": "error",
            "message": "User not found"
        }), 404

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "status": "error",
            "message": "Request body must contain JSON"
        }), 400

    username = data.get("username")
    email = data.get("email")

    if username is not None:
        if not isinstance(username, str) or not username.strip():
            return jsonify({
                "status": "error",
                "message": "Username cannot be empty"
            }), 400

        username = username.strip()

        if len(username) > 50:
            return jsonify({
                "status": "error",
                "message": "Username must be 50 characters or fewer"
            }), 400

        existing = User.query.filter(
            User.username == username,
            User.id != user_id
        ).first()

        if existing:
            return jsonify({
                "status": "error",
                "message": "Username already exists"
            }), 409

        user.username = username

    if email is not None:
        if not isinstance(email, str) or not email.strip():
            return jsonify({
                "status": "error",
                "message": "Email cannot be empty"
            }), 400

        email = email.strip().lower()

        if len(email) > 100 or "@" not in email:
            return jsonify({
                "status": "error",
                "message": "Please provide a valid email"
            }), 400

        existing = User.query.filter(
            User.email == email,
            User.id != user_id
        ).first()

        if existing:
            return jsonify({
                "status": "error",
                "message": "Email already exists"
            }), 409

        user.email = email

    if username is None and email is None:
        return jsonify({
            "status": "error",
            "message": "Provide a username or email to update"
        }), 400

    try:
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "User updated successfully!",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        }), 200

    except IntegrityError:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": "Username or email already exists"
        }), 409



# DELETE USER
@users_bp.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):

    user = db.session.get(User, user_id)

    if user is None:
        return jsonify({
            "status": "error",
            "message": "User not found"
        }), 404

    try:
        db.session.delete(user)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "User deleted successfully!"
        }), 200

    except Exception:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": "Unable to delete user"
        }), 500
