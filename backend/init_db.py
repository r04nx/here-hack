import sqlite3
import os

def init_db():
    """Initialize the database with the required schema"""
    # Ensure the instance directory exists
    os.makedirs('instance', exist_ok=True)
    
    # Connect to the database
    conn = sqlite3.connect('instance/database.db')
    cursor = conn.cursor()
    
    # Create geojson_data table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS geojson_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        size INTEGER NOT NULL,
        vendor_name TEXT NOT NULL,
        geojson_data TEXT NOT NULL,
        file_hash TEXT,
        file_path TEXT,
        date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Create analysis_results table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS analysis_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        geojson_id INTEGER NOT NULL,
        confidence_score REAL,
        recommendation TEXT,
        reasoning TEXT,
        analysis_data TEXT,
        date_analyzed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (geojson_id) REFERENCES geojson_data (id)
    )
    ''')
    
    conn.commit()
    conn.close()
    
    print("Database initialized successfully")

if __name__ == "__main__":
    init_db()
