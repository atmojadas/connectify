
from app import db
from sqlalchemy.sql import func


class Like(db.Model):

    # Connect this class to the likes table
    __tablename__ = "likes"

    # Unique like ID
    id = db.Column(
        db.Integer,
        primary_key=True
    )

    # ID of the user who liked the post
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    # ID of the post that received the like
    post_id = db.Column(
        db.Integer,
        db.ForeignKey("posts.id"),
        nullable=False
    )

    # Time when the like was created
    created_at = db.Column(
        db.DateTime,
        server_default=func.current_timestamp()
    )

    # Prevent the same user from liking the same post twice
    __table_args__ = (
        db.UniqueConstraint(
            "user_id",
            "post_id",
            name="unique_user_post"
        ),
    )

    def __repr__(self):
        return f"<Like user={self.user_id} post={self.post_id}>"
