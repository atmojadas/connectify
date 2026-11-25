
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def create_app():

    app = Flask(__name__)

    app.config.from_object("app.config.Config")

    db.init_app(app)

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": "http://localhost:5173"
            }
        }
    )

    # Import routes
    from app.routes.health import health_bp
    from app.routes.users import users_bp

    # Register routes
    app.register_blueprint(
        health_bp,
        url_prefix="/api"
    )

    app.register_blueprint(
        users_bp,
        url_prefix="/api"
    )

    return app
