
from app import db
from sqlalchemy.sql import func


class User(db.Model):

    # Connect this Python class to the users table
    __tablename__ = "users"

    # Table columns
    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )

    email = db.Column(
        db.String(100),
        unique=True,
        nullable=False
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        server_default=func.current_timestamp()
    )

    def __repr__(self):
        return f"<User {self.username}>"
