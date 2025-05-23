"""
Configuration settings for the backend application.
"""
import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

# Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyAO9x7Wz4xsYq1wPDPoyLN_zobPBGFK4VA")

# Google Search API settings
GOOGLE_SEARCH_API_KEY = os.getenv("GOOGLE_SEARCH_API_KEY", "")
GOOGLE_SEARCH_ENGINE_ID = os.getenv("GOOGLE_SEARCH_ENGINE_ID", "")

# News API settings
NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")

# Application settings
DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")
