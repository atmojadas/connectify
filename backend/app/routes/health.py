

from flask import Blueprint, jsonify
from sqlalchemy import text
from app import db


# Create a Blueprint
health_bp = Blueprint("health", __name__)


# Backend health check
@health_bp.route("/health", methods=["GET"])
def health_check():

    return jsonify({
        "status": "success",
        "message": "Connectify backend is running!"
    }), 200


# Database connection health check
@health_bp.route("/db-health", methods=["GET"])
def database_health():

    try:
        db.session.execute(text("SELECT 1"))

        return jsonify({
            "status": "success",
            "message": "Database connection successful!"
        }), 200

    except Exception as error:
        db.session.rollback()

        print("Database connection error:", error)

        return jsonify({
            "status": "error",
            "message": "Database connection failed"
        }), 500



