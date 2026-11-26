
from app import db
from sqlalchemy.sql import func


class Post(db.Model):

    # Connect this class to the posts table
    __tablename__ = "posts"

    # Unique post ID
    id = db.Column(
        db.Integer,
        primary_key=True
    )

    # ID of the user who created this post
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    # Actual post content
    content = db.Column(
        db.Text,
        nullable=False
    )

    # Post creation time
    created_at = db.Column(
        db.DateTime,
        server_default=func.current_timestamp()
    )

    # Last modification time
    updated_at = db.Column(
        db.DateTime,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp()
    )

    # Relationship with User model
    author = db.relationship(
        "User",
        backref="posts"
    )

    def __repr__(self):
        return f"<Post {self.id}>"
