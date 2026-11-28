from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager


db = SQLAlchemy()
jwt = JWTManager()


def create_app():

    app = Flask(__name__)

    # Load configuration
    app.config.from_object("app.config.Config")

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)

    # Allow React frontend communication
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": "http://localhost:5173"
            }
        }
    )

    # Import database models
    from app.models.like import Like

    # Import routes
    from app.routes.health import health_bp
    from app.routes.users import users_bp
    from app.routes.posts import posts_bp
    from app.routes.comments import comments_bp
    from app.routes.likes import likes_bp

    # Register Health routes
    app.register_blueprint(
        health_bp,
        url_prefix="/api"
    )

    # Register User routes
    app.register_blueprint(
        users_bp,
        url_prefix="/api"
    )

    # Register Post routes
    app.register_blueprint(
        posts_bp,
        url_prefix="/api"
    )

    # Register Comment routes
    app.register_blueprint(
        comments_bp,
        url_prefix="/api"
    )

    # Register Like routes
    app.register_blueprint(
        likes_bp,
        url_prefix="/api"
    )

    return app