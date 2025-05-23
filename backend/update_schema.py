import sqlite3
import os

def get_db_connection():
    """Create a connection to the SQLite database"""
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'instance', 'database.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def check_schema():
    """Check the current schema of the geojson_data table"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get the current schema
    cursor.execute("PRAGMA table_info(geojson_data)")
    columns = cursor.fetchall()
    
    column_names = [column['name'] for column in columns]
    print("Current columns:", column_names)
    
    # Check if file_hash and file_path columns exist
    has_file_hash = 'file_hash' in column_names
    has_file_path = 'file_path' in column_names
    
    if not has_file_hash or not has_file_path:
        print("Adding missing columns...")
        
        if not has_file_hash:
            cursor.execute("ALTER TABLE geojson_data ADD COLUMN file_hash TEXT")
            print("Added file_hash column")
            
        if not has_file_path:
            cursor.execute("ALTER TABLE geojson_data ADD COLUMN file_path TEXT")
            print("Added file_path column")
            
        conn.commit()
        print("Schema updated successfully")
    else:
        print("Schema is already up to date")
    
    conn.close()

if __name__ == "__main__":
    check_schema()
