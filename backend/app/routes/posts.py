
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models.post import Post


posts_bp = Blueprint("posts", __name__)


# CREATE POST
@posts_bp.route("/posts", methods=["POST"])
@jwt_required()
def create_post():

    # Get the logged-in user's ID from JWT
    user_id = int(get_jwt_identity())

    # Get request data
    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "status": "error",
            "message": "Request body must contain JSON"
        }), 400

    content = data.get("content")

    if not isinstance(content, str) or not content.strip():
        return jsonify({
            "status": "error",
            "message": "Post content cannot be empty"
        }), 400

    # Create a new post
    new_post = Post(
        user_id=user_id,
        content=content.strip()
    )

    try:
        db.session.add(new_post)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Post created successfully!",
            "post": {
                "id": new_post.id,
                "user_id": new_post.user_id,
                "username": new_post.author.username,
                "content": new_post.content,
                "created_at": (
                    new_post.created_at.isoformat()
                    if new_post.created_at else None
                )
            }
        }), 201

    except Exception:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": "Unable to create post"
        }), 500


# READ ALL POSTS
@posts_bp.route("/posts", methods=["GET"])
def get_posts():

    posts = Post.query.order_by(
        Post.created_at.desc()
    ).all()

    posts_list = []

    for post in posts:

        posts_list.append({
            "id": post.id,
            "user_id": post.user_id,
            "username": post.author.username,
            "content": post.content,
            "created_at": (
                post.created_at.isoformat()
                if post.created_at else None
            )
        })

    return jsonify({
        "status": "success",
        "posts": posts_list
    }), 200


# UPDATE POST
@posts_bp.route("/posts/<int:post_id>", methods=["PUT"])
@jwt_required()
def update_post(post_id):

    # Get the logged-in user's ID
    user_id = int(get_jwt_identity())

    # Find the post
    post = db.session.get(Post, post_id)

    if post is None:
        return jsonify({
            "status": "error",
            "message": "Post not found"
        }), 404

    # Check whether the logged-in user owns this post
    if post.user_id != user_id:
        return jsonify({
            "status": "error",
            "message": "You are not allowed to edit this post"
        }), 403

    # Get updated post content
    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "status": "error",
            "message": "Request body must contain JSON"
        }), 400

    content = data.get("content")

    if not isinstance(content, str) or not content.strip():
        return jsonify({
            "status": "error",
            "message": "Post content cannot be empty"
        }), 400

    try:
        # Update the post
        post.content = content.strip()

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Post updated successfully!",
            "post": {
                "id": post.id,
                "user_id": post.user_id,
                "username": post.author.username,
                "content": post.content,
                "created_at": (
                    post.created_at.isoformat()
                    if post.created_at else None
                )
            }
        }), 200

    except Exception:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": "Unable to update post"
        }), 500



# DELETE POST
@posts_bp.route("/posts/<int:post_id>", methods=["DELETE"])
@jwt_required()
def delete_post(post_id):

    # Get the logged-in user's ID
    user_id = int(get_jwt_identity())

    # Find the post
    post = db.session.get(Post, post_id)

    if post is None:
        return jsonify({
            "status": "error",
            "message": "Post not found"
        }), 404

    # Check whether the logged-in user owns this post
    if post.user_id != user_id:
        return jsonify({
            "status": "error",
            "message": "You are not allowed to delete this post"
        }), 403

    try:
        # Delete the post
        db.session.delete(post)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Post deleted successfully!"
        }), 200

    except Exception:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": "Unable to delete post"
        }), 500
