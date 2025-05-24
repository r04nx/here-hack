# RoadFusion: AI-Powered Smart Road Data Merger

<div align="center">
  <img src="frontend/assets/logo-no-bg.png" alt="RoadFusion Logo" width="200" />
  <p><em>Transforming Road Data Management with Multi-Agent AI</em></p>
</div>

## 🌟 Overview

RoadFusion is a cutting-edge platform that revolutionizes how road infrastructure data is validated, analyzed, and merged into production systems. Using a sophisticated multi-agent AI architecture, RoadFusion ensures that only high-quality, validated road data makes it into mapping systems, improving navigation accuracy and safety for millions of users worldwide.

## 📸 Screenshots

### Analyst Dashboard - Multi-Agent Analysis
<div align="center">
  <img src="frontend/assets/Screenshot from 2025-05-24 12-23-04.png" alt="RoadFusion Analyst Dashboard" width="800" />
  <p><em>Analyst dashboard showing the multi-agent analysis pipeline in action</em></p>
</div>

### Map Visualization Interface
<div align="center">
  <img src="frontend/assets/Screenshot from 2025-05-24 12-23-31.png" alt="RoadFusion Map Visualization" width="800" />
  <p><em>Interactive map visualization of road data with quality indicators</em></p>
</div>

### Vendor Trust Score Dashboard
<div align="center">
  <img src="frontend/assets/Screenshot from 2025-05-24 12-24-53.png" alt="Vendor Trust Scores" width="800" />
  <p><em>Vendor trust score dashboard showing historical performance metrics</em></p>
</div>

### Decision Analysis Interface
<div align="center">
  <img src="frontend/assets/Screenshot from 2025-05-24 12-32-33.png" alt="Decision Analysis Interface" width="800" />
  <p><em>Detailed decision analysis with confidence scores and reasoning</em></p>
</div>

### Mobile Companion App
<div align="center">
  <img src="frontend/assets/Untitled design.png" alt="Mobile Companion App" width="600" />
  <p><em>Mobile companion app for field validation and user feedback collection</em></p>
</div>


## 🚀 Unique Selling Points

### 1. Multi-Agent AI Architecture

RoadFusion employs a sophisticated multi-agent system where specialized AI agents work collaboratively to analyze road data:

- **Data Extraction Agent**: Processes raw GeoJSON data to identify road segments, intersections, and traffic signals
- **External Validation Agent**: Cross-references data with trusted sources like Google Maps, Waze, and OpenStreetMap
- **News Analysis Agent**: Scans recent news for road construction, closures, or changes that might affect data accuracy
- **Decision Agent**: Combines all inputs to make the final merge recommendation with confidence scoring

### 2. Reinforcement Learning Trust System

Our platform features a unique vendor trust scoring system that evolves over time:

- Vendor trust scores are dynamically updated based on data quality history
- Each successful merge increases vendor reliability ratings
- Poor quality submissions decrease trust scores
- System automatically adjusts approval thresholds based on historical performance

### 3. User Feedback Integration

RoadFusion incorporates real-world feedback to continuously improve:

- Companion mobile app allows users to submit field observations
- Feedback is used to validate vendor data submissions
- Reinforcement learning mechanisms incorporate user reports into trust calculations
- Creates a virtuous cycle of data improvement

### 4. Transparent Decision Making

Unlike black-box systems, RoadFusion provides clear reasoning for all decisions:

- Detailed confidence scores with component breakdowns
- Visual comparison of submitted data vs. existing map data
- Comprehensive reasoning for approval/rejection decisions
- Full audit trail of all data validations

## 🛠️ Technology Stack

### Backend

- **Python**: Core application logic and API endpoints
- **Flask**: Web framework for RESTful API
- **SQLite**: Database for storing GeoJSON files and analysis results
- **Google Gemini Pro**: Advanced LLM for complex reasoning and decision-making

### Frontend

- **React**: UI framework with TypeScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: Component library
- **Vite**: Build tool and development server

### Data Processing

- **GeoJSON**: Standard format for geospatial data
- **HERE Maps API**: Geospatial data validation and enrichment
- **OpenStreetMap**: Reference data for validation

### External APIs

<div style="display: flex; justify-content: space-between; margin: 20px 0;">
  <img src="https://developers.google.com/static/maps/images/maps-icon.svg" alt="Google Maps API" width="60" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Openstreetmap_logo.svg/256px-Openstreetmap_logo.svg.png" alt="OpenStreetMap" width="60" />
  <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_advanced_1440.svg" alt="Google Gemini" width="60" />
  <img src="https://static-website.waze.com/assets/favicon-b3a7f59763717c6a8e2154d3e73ed1e1e08d2c02681a411fdaec1bd0f62eb56f.ico" alt="Waze" width="60" />
  <img src="https://www.here.com/themes/custom/here_base_theme/images/favicon-32x32.png" alt="HERE Maps" width="60" />
</div>

## 🏗️ System Architecture

### High-Level Architecture

```mermaid
flowchart TD
    subgraph "User Interfaces"
        VP[Vendor Portal] 
        AP[Analyst Portal]
        MA[Mobile App\nUser Feedback]
    end
    
    subgraph "API Layer"
        API[REST API Services]    
    end
    
    subgraph "Multi-Agent AI System"
        MAIS[AI Orchestrator]
        
        subgraph "Specialized Agents"
            DEA[Data Extraction Agent]
            EVA[External Validation Agent]
            NAA[News Analysis Agent]
            DMA[Decision Making Agent]
        end
        
        DEA --> EVA
        EVA --> NAA
        NAA --> DMA
    end
    
    subgraph "External Services"
        GM[Google Maps API]
        OSM[OpenStreetMap API]
        WZ[Waze API]
        HM[HERE Maps API]
        GEM[Google Gemini Pro]
    end
    
    subgraph "Data Storage"
        DB[(SQLite Database)]
        GJ[(GeoJSON Files)]
    end
    
    VP --> API
    AP --> API
    MA --> API
    
    API --> MAIS
    MAIS --> DEA
    
    DEA --> DB
    EVA --> GM
    EVA --> OSM
    EVA --> WZ
    EVA --> HM
    NAA --> GEM
    DMA --> GEM
    
    DEA --> GJ
    
    MAIS --> API
    
    classDef interfaces fill:#f9f,stroke:#333,stroke-width:2px,color:#000
    classDef api fill:#bbf,stroke:#333,stroke-width:2px,color:#000
    classDef agents fill:#bfb,stroke:#333,stroke-width:2px,color:#000
    classDef external fill:#fbb,stroke:#333,stroke-width:2px,color:#000
    classDef storage fill:#bff,stroke:#333,stroke-width:2px,color:#000
    
    class VP,AP,MA interfaces
    class API api
    class DEA,EVA,NAA,DMA,MAIS agents
    class GM,OSM,WZ,HM,GEM external
    class DB,GJ storage
```

### Multi-Agent System Detail

```mermaid
flowchart LR
    GJ[GeoJSON Data] --> DEA
    
    subgraph "Multi-Agent Pipeline"
        DEA[Data Extraction Agent] --> |Road Segments\nIntersections\nTraffic Signals| EVA
        EVA[External Validation Agent] --> |Validation Results\nMatch Rates| NAA
        NAA[News Analysis Agent] --> |News Impact\nRecent Changes| DMA
        DMA[Decision Making Agent] --> |Final Decision\nConfidence Score| OUT
    end
    
    subgraph "Data Extraction Agent"
        direction TB
        DEA1[Parse GeoJSON] --> DEA2[Extract Features]
        DEA2 --> DEA3[Identify Road Segments]
        DEA2 --> DEA4[Detect Intersections]
        DEA2 --> DEA5[Locate Traffic Signals]
        DEA3 & DEA4 & DEA5 --> DEA6[Enrich with Metadata]
    end
    
    subgraph "External Validation Agent"
        direction TB
        EVA1[Query Google Maps] --> EVA4[Calculate Match Rates]
        EVA2[Query OpenStreetMap] --> EVA4
        EVA3[Query Waze] --> EVA4
        EVA4 --> EVA5[Identify Discrepancies]
        EVA5 --> EVA6[Generate Validation Score]
    end
    
    subgraph "News Analysis Agent"
        direction TB
        NAA1[Search Local News] --> NAA2[Filter Road-Related Articles]
        NAA2 --> NAA3[Analyze with Gemini Pro]
        NAA3 --> NAA4[Extract Relevant Changes]
        NAA4 --> NAA5[Calculate News Impact Score]
    end
    
    subgraph "Decision Making Agent"
        direction TB
        DMA1[Combine All Inputs] --> DMA2[Apply Vendor Trust Score]
        DMA2 --> DMA3[Calculate Confidence Score]
        DMA3 --> DMA4[Generate Reasoning]
        DMA4 --> DMA5[Make Recommendation]
    end
    
    OUT[Decision Output] --> |Approve/Reject| DB[(Database)]
    
    classDef agent fill:#bfb,stroke:#333,stroke-width:2px,color:#000
    classDef subProcess fill:#dfd,stroke:#333,stroke-width:1px,color:#000
    classDef data fill:#bbf,stroke:#333,stroke-width:1px,color:#000
    
    class DEA,EVA,NAA,DMA agent
    class DEA1,DEA2,DEA3,DEA4,DEA5,DEA6,EVA1,EVA2,EVA3,EVA4,EVA5,EVA6,NAA1,NAA2,NAA3,NAA4,NAA5,DMA1,DMA2,DMA3,DMA4,DMA5 subProcess
    class GJ,OUT,DB data
```

### Reinforcement Learning Trust System

```mermaid
flowchart TD
    subgraph "Vendor Trust System"
        direction LR
        VU[Vendor Upload] --> QA[Quality Assessment]
        QA --> |Score| TS[Trust Score Update]
        TS --> |Affects| AT[Approval Threshold]
        AT --> |Influences| FD[Future Decisions]
        FD --> |Feedback| TS
    end
    
    subgraph "User Feedback Loop"
        direction LR
        MD[Merged Data] --> UF[User Feedback]
        UF --> |Field Validation| QV[Quality Verification]
        QV --> |Reinforcement Signal| TS
    end
    
    subgraph "Trust Score Components"
        direction TB
        HS[Historical Submissions] --> TSC
        AR[Approval Rate] --> TSC
        DR[Discrepancy Rate] --> TSC
        UFB[User Feedback] --> TSC
        TSC[Trust Score Calculation] --> TS
    end
    
    classDef process fill:#bfb,stroke:#333,stroke-width:2px,color:#000
    classDef data fill:#bbf,stroke:#333,stroke-width:1px,color:#000
    classDef feedback fill:#fbb,stroke:#333,stroke-width:1px,color:#000
    
    class VU,MD data
    class QA,TS,AT,FD,TSC process
    class UF,QV,UFB feedback
```

## 📊 Data Flow

```mermaid
flowchart TD
    %% Main flow
    Start([Start]) --> VU[Vendor Uploads GeoJSON]
    VU --> QC{Quality Check}
    QC -->|Pass| MA[Multi-Agent Analysis]
    QC -->|Fail| RE[Return to Vendor]
    RE --> VU
    
    %% Multi-agent analysis process
    MA --> DEA[Data Extraction Agent]
    DEA --> EVA[External Validation Agent]
    EVA --> NAA[News Analysis Agent]
    NAA --> DMA[Decision Making Agent]
    DMA --> AR[AI Recommendation]
    
    %% Human review process
    AR --> HR{Human Review}
    HR -->|Approve| MI[Merge Into Production]
    HR -->|Reject| RJ[Reject with Feedback]
    RJ --> VU
    
    %% Feedback loop
    MI --> PD[Production Database]
    PD --> UF[User Feedback Collection]
    UF --> QV[Quality Verification]
    QV --> TS[Update Vendor Trust Score]
    TS --> VTS[(Vendor Trust Score DB)]
    VTS -.->|Influences| DMA
    
    %% Data enrichment
    MI --> RL[Reinforcement Learning]
    RL --> IM[Improve Models]
    IM -.->|Enhances| DEA
    IM -.->|Enhances| EVA
    IM -.->|Enhances| NAA
    IM -.->|Enhances| DMA
    
    %% Detailed steps for each agent
    subgraph "Data Extraction Process"
        DEA1[Parse GeoJSON] --> DEA2[Extract Road Features]
        DEA2 --> DEA3[Identify Connectivity]
        DEA3 --> DEA4[Calculate Quality Metrics]
    end
    DEA --- DEA1
    
    subgraph "External Validation Process"
        EVA1[Query External Maps] --> EVA2[Compare Features]
        EVA2 --> EVA3[Calculate Match Rates]
        EVA3 --> EVA4[Identify Discrepancies]
    end
    EVA --- EVA1
    
    subgraph "News Analysis Process"
        NAA1[Search Local News] --> NAA2[Filter Road-Related]
        NAA2 --> NAA3[Analyze with LLM]
        NAA3 --> NAA4[Calculate Impact Score]
    end
    NAA --- NAA1
    
    subgraph "Decision Making Process"
        DMA1[Combine All Inputs] --> DMA2[Apply Trust Score]
        DMA2 --> DMA3[Calculate Confidence]
        DMA3 --> DMA4[Generate Reasoning]
    end
    DMA --- DMA1
    
    %% Styling
    classDef process fill:#bbf,stroke:#333,stroke-width:1px,color:#000
    classDef decision fill:#fbb,stroke:#333,stroke-width:1px,color:#000
    classDef agent fill:#bfb,stroke:#333,stroke-width:2px,color:#000
    classDef storage fill:#bff,stroke:#333,stroke-width:1px,color:#000
    classDef start fill:#f9f,stroke:#333,stroke-width:2px,color:#000
    
    class Start start
    class VU,RE,AR,MI,PD,UF,QV,TS,RL,IM process
    class QC,HR decision
    class DEA,EVA,NAA,DMA agent
    class VTS storage
    class DEA1,DEA2,DEA3,DEA4,EVA1,EVA2,EVA3,EVA4,NAA1,NAA2,NAA3,NAA4,DMA1,DMA2,DMA3,DMA4 process
```

### Data Flow Description

1. **Data Submission**: Vendors upload GeoJSON files through the vendor portal
2. **Initial Quality Check**: Basic validation of GeoJSON format and structure
3. **Multi-Agent Analysis**:
   - **Data Extraction Agent**: Processes the raw GeoJSON to identify road segments, intersections, and traffic signals
   - **External Validation Agent**: Cross-references with trusted sources like Google Maps, Waze, and OpenStreetMap
   - **News Analysis Agent**: Checks for relevant road updates, construction, or closures in the area
   - **Decision Agent**: Combines all inputs to make a recommendation with confidence scoring
4. **Analyst Review**: Human analysts review AI recommendations and make final decisions
5. **Production Integration**: Approved data is merged into production systems
6. **Feedback Loop**: User feedback from the companion app validates merged data and updates vendor trust scores
7. **Continuous Learning**: The system uses reinforcement learning to improve agent performance over time

## 🚗 Use Cases

- **Map Data Providers**: Validate and merge road network updates from multiple sources
- **Transportation Departments**: Maintain accurate road infrastructure databases
- **Navigation Companies**: Ensure high-quality road data for routing algorithms
- **Urban Planners**: Analyze road network changes and plan infrastructure improvements
- **Emergency Services**: Access the most up-to-date road information for critical response

## 🛠️ Setup and Installation

### Prerequisites

- Python 3.9+
- Node.js 16+
- pnpm or npm
- SQLite

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/roadfusion.git
cd roadfusion

# Set up Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Initialize the database
python create_db.py

# Start the backend server
python app.py
```

### Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
pnpm install  # or npm install

# Start the development server
pnpm run dev  # or npm run dev
```

## 🔧 Configuration

Create a `.env` file in the backend directory with the following variables:

```
FLASK_APP=app.py
FLASK_ENV=development
DATABASE_PATH=database.db
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
HERE_API_KEY=your_here_api_key
```

## 📱 Mobile Companion App

The RoadFusion ecosystem includes a mobile companion app that allows users to submit real-time feedback about road conditions, construction, and map accuracy. This feedback is incorporated into the AI analysis pipeline to improve data quality and validation.

Key features of the mobile app include:

- Real-time road condition reporting
- Photo submission of road issues
- GPS-tagged feedback for precise location mapping
- Integration with the vendor trust scoring system
- Gamification elements to encourage user participation

User feedback serves as a critical reinforcement learning signal that continuously improves the quality of our road data and vendor trust assessments.

## 🤝 Contributing

We welcome contributions to RoadFusion! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- HERE Technologies for providing mapping APIs and hosting the hackathon
- Google for Gemini Pro API access
- OpenStreetMap community for open geospatial data
- All contributors and testers who helped improve RoadFusion
