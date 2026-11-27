
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models.comment import Comment
from app.models.post import Post
from app.models.user import User


comments_bp = Blueprint("comments", __name__)


# GET COMMENTS FOR A POST
@comments_bp.route("/posts/<int:post_id>/comments", methods=["GET"])
def get_comments(post_id):

    post = db.session.get(Post, post_id)

    if not post:
        return jsonify({
            "status": "error",
            "message": "Post not found"
        }), 404

    comments = Comment.query.filter_by(
        post_id=post_id
    ).order_by(Comment.created_at.asc()).all()

    result = []

    for comment in comments:
        result.append({
            "id": comment.id,
            "user_id": comment.user_id,
            "post_id": comment.post_id,
            "username": comment.author.username,
            "content": comment.content,
            "created_at": comment.created_at.isoformat()
        })

    return jsonify({
        "status": "success",
        "comments": result
    }), 200


# CREATE A COMMENT
@comments_bp.route("/posts/<int:post_id>/comments", methods=["POST"])
@jwt_required()
def create_comment(post_id):

    user_id = int(get_jwt_identity())

    post = db.session.get(Post, post_id)

    if not post:
        return jsonify({
            "status": "error",
            "message": "Post not found"
        }), 404

    data = request.get_json(silent=True) or {}

    content = data.get("content", "")

    if not isinstance(content, str) or not content.strip():
        return jsonify({
            "status": "error",
            "message": "Comment cannot be empty"
        }), 400

    comment = Comment(
        user_id=user_id,
        post_id=post_id,
        content=content.strip()
    )

    try:
        db.session.add(comment)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Comment created successfully!",
            "comment": {
                "id": comment.id,
                "user_id": comment.user_id,
                "post_id": comment.post_id,
                "username": comment.author.username,
                "content": comment.content,
                "created_at": comment.created_at.isoformat()
            }
        }), 201

    except Exception:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": "Unable to create comment"
        }), 500
