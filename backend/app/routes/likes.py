from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from sqlalchemy.exc import IntegrityError

from app import db
from app.models.like import Like
from app.models.post import Post


likes_bp = Blueprint("likes", __name__)

# GET LIKES FOR A POST
# GET LIKES FOR A POST
@likes_bp.route("/posts/<int:post_id>/likes", methods=["GET"])
@jwt_required(optional=True)
def get_likes(post_id):

    post = db.session.get(Post, post_id)

    if not post:
        return jsonify({
            "status": "error",
            "message": "Post not found"
        }), 404

    like_count = Like.query.filter_by(
        post_id=post_id
    ).count()

    user_id = get_jwt_identity()

    liked_by_user = False

    if user_id is not None:
        liked_by_user = Like.query.filter_by(
            user_id=int(user_id),
            post_id=post_id
        ).first() is not None

    return jsonify({
        "status": "success",
        "post_id": post_id,
        "like_count": like_count,
        "liked_by_user": liked_by_user
    }), 200
    
    # LIKE A POST
@likes_bp.route("/posts/<int:post_id>/likes", methods=["POST"])
@jwt_required()
def like_post(post_id):

    user_id = int(get_jwt_identity())

    post = db.session.get(Post, post_id)

    if not post:
        return jsonify({
            "status": "error",
            "message": "Post not found"
        }), 404

    # Check whether the user already liked this post
    existing_like = Like.query.filter_by(
        user_id=user_id,
        post_id=post_id
    ).first()

    if existing_like:
        return jsonify({
            "status": "success",
            "message": "You already liked this post"
        }), 200

    # Create a new like
    new_like = Like(
        user_id=user_id,
        post_id=post_id
    )

    try:
        db.session.add(new_like)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Post liked successfully"
        }), 201

    except IntegrityError:
        db.session.rollback()

        return jsonify({
            "status": "success",
            "message": "You already liked this post"
        }), 200
        
        # UNLIKE A POST
@likes_bp.route("/posts/<int:post_id>/likes", methods=["DELETE"])
@jwt_required()
def unlike_post(post_id):

    user_id = int(get_jwt_identity())

    post = db.session.get(Post, post_id)

    if not post:
        return jsonify({
            "status": "error",
            "message": "Post not found"
        }), 404

    existing_like = Like.query.filter_by(
        user_id=user_id,
        post_id=post_id
    ).first()

    if not existing_like:
        return jsonify({
            "status": "success",
            "message": "You have not liked this post"
        }), 200

    db.session.delete(existing_like)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Post unliked successfully"
    }), 200