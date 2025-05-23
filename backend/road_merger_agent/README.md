# Smart Road Data Merger System

This system implements an AI-powered road data merger using Google's Agent Development Kit (ADK). It uses a multi-agent approach to analyze, validate, and merge road data from different vendors.

## Architecture

The system consists of four specialized AI agents working together:

1. **Data Extraction Agent**: Extracts road segments, intersections, and traffic signals from GeoJSON data. Makes requests to OpenStreetMap Nominatim API for location validation and enrichment.

2. **External Validation Agent**: Validates extracted data against external map sources including Google Maps, Waze, and other proprietary datasets. Calculates match rates and identifies discrepancies.

3. **News Analysis Agent**: Searches for and analyzes recent news articles about the region using a RAG-enhanced LLM. Identifies relevant road construction reports, closures, or changes that might affect data accuracy.

4. **Decision Agent**: Analyzes combined data from all agents, calculates confidence scores, and makes the final decision on whether to approve the data merge. Considers vendor trust scores in the decision-making process.

## Reinforcement Learning for Trust Scores

The system uses reinforcement learning to calculate and update vendor trust scores based on:

- Historical data accuracy
- Analyst approval rate
- Data consistency over time
- External validation results

These trust scores are used to determine whether data can be automatically merged or requires manual review.

## API Endpoints

The system exposes the following API endpoints:

### `/ai_merger/analyze` (POST)

Analyzes a GeoJSON file using the AI-powered road merger agent.

**Request Body:**
```json
{
    "geojson_data": {...},  // GeoJSON data
    "vendor_name": "..."    // Name of the vendor
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "extraction": {...},
        "validation": {...},
        "news_analysis": {...},
        "decision": {...}
    }
}
```

### `/ai_merger/trust_scores` (GET)

Gets vendor trust scores.

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "name": "RoadTech Solutions",
            "score": 92,
            "trend": "+2.4%",
            "history": [85, 87, 90, 88, 92]
        },
        ...
    ]
}
```

### `/ai_merger/merge_history` (GET)

Gets merge history.

**Response:**
```json
{
    "success": true,
    "data": [
        { 
            "id": 1, 
            "date": "2025-05-23", 
            "vendor": "RoadTech Solutions",
            "region": "Downtown",
            "segments": 127,
            "confidence": 94,
            "status": "completed",
            "aiVerified": true,
            "trustScore": 92
        },
        ...
    ]
}
```

### `/ai_merger/merge` (POST)

Merges GeoJSON files using the AI-powered road merger agent.

**Request Body:**
```json
{
    "geojson_data1": {...},  // First GeoJSON data
    "geojson_data2": {...},  // Second GeoJSON data
    "vendor_name": "...",    // Name of the vendor
    "auto_merge": true       // Whether to auto-merge based on trust score
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "merged_geojson": {...},
        "stats": {...}
    }
}
```

## Installation

1. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Set up Google ADK:
   ```
   python -m venv .venv
   source .venv/bin/activate
   pip install google-adk
   ```

## Usage

1. Start the Flask server:
   ```
   python app.py
   ```

2. Make API requests to the endpoints described above.

## Integration with Frontend

The system integrates with the frontend through the API endpoints. The frontend displays:

1. Vendor trust scores with mini-graphs
2. Multi-agent analysis process visualization
3. Merge history and results
4. Interactive controls for auto-merge threshold
