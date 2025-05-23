CREATE TABLE geojson_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    size INTEGER NOT NULL,
    vendor_name TEXT NOT NULL,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    geojson_data JSON NOT NULL,
    is_merged INTEGER DEFAULT 0
); 