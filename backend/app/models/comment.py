
from app import db
from sqlalchemy.sql import func


class Comment(db.Model):

    __tablename__ = "comments"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    post_id = db.Column(
        db.Integer,
        db.ForeignKey("posts.id"),
        nullable=False
    )

    content = db.Column(
        db.Text,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        server_default=func.current_timestamp()
    )

    author = db.relationship(
        "User",
        backref="comments"
    )

    post = db.relationship(
        "Post",
        backref="comments"
    )

    def __repr__(self):
        return f"<Comment {self.id}>"
