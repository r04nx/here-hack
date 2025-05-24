CREATE TABLE IF NOT EXISTS merge_operations (
    id SERIAL PRIMARY KEY,
    file1_name VARCHAR(255) NOT NULL,
    file2_name VARCHAR(255) NOT NULL,
    similarity_threshold FLOAT NOT NULL,
    merge_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    output_file_id UUID NOT NULL,
    total_roads_file1 INTEGER NOT NULL,
    total_roads_file2 INTEGER NOT NULL,
    total_roads_merged INTEGER NOT NULL,
    roads_merged INTEGER NOT NULL,
    roads_skipped INTEGER NOT NULL,
    roads_added INTEGER NOT NULL,
    merge_duration_ms INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'completed',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_merge_operations_date ON merge_operations(merge_date);
CREATE INDEX IF NOT EXISTS idx_merge_operations_files ON merge_operations(file1_name, file2_name); 