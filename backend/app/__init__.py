
from flask import Flask
from flask_cors import CORS

from app.routes.health import health_bp


def create_app():

    # Create Flask application
    app = Flask(__name__)

    # Enable communication with React
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": "http://localhost:5173"
            }
        }
    )

    # Register API routes
    app.register_blueprint(health_bp, url_prefix="/api")

    return app
