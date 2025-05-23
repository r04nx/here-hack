import sqlite3

def create_database():
    # Connect to database (will create it if it doesn't exist)
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # Create geojson table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS geojson (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Create merge_history table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS merge_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vendor_name TEXT,
        status TEXT,
        confidence_score REAL,
        region TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Create vendor_trust_scores table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS vendor_trust_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vendor_name TEXT,
        trust_score REAL,
        trend TEXT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Insert some sample data for testing
    # Sample vendor trust scores
    cursor.execute("DELETE FROM vendor_trust_scores")
    vendors = [
        ('RoadTech Solutions', 92, 'up'),
        ('MapData Inc.', 78, 'stable'),
        ('GeoSpatial Experts', 65, 'down')
    ]
    cursor.executemany(
        "INSERT INTO vendor_trust_scores (vendor_name, trust_score, trend) VALUES (?, ?, ?)",
        vendors
    )
    
    # Sample merge history
    cursor.execute("DELETE FROM merge_history")
    history = [
        ('RoadTech Solutions', 'approved', 87, 'Mumbai'),
        ('MapData Inc.', 'reviewed', 72, 'Delhi'),
        ('GeoSpatial Experts', 'rejected', 45, 'Bangalore')
    ]
    cursor.executemany(
        "INSERT INTO merge_history (vendor_name, status, confidence_score, region) VALUES (?, ?, ?, ?)",
        history
    )
    
    # Commit changes and close connection
    conn.commit()
    conn.close()
    
    print("Database created successfully with sample data!")

if __name__ == "__main__":
    create_database()
