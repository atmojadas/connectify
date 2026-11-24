
from flask import Blueprint, jsonify

# Create a Blueprint
health_bp = Blueprint("health", __name__)


@health_bp.route("/health", methods=["GET"])
def health_check():

    return jsonify({
        "status": "success",
        "message": "Connectify backend is running!"
    }), 200
