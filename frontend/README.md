# HERE Tech Hackathon - Road Data Merger

A smart road data merger application that uses AI-powered analysis and trust-based approval system for merging road data from different vendors.

## Features

- **Vendor Trust Scores**: Reinforcement learning based trust scores for data providers
- **Multi-Agent Analysis**: AI-powered data validation and verification system
- **Map View**: Visual representation of road data
- **Merge History**: Track and analyze previous road data merge operations

## Tech Stack

- **Frontend**:
  - React
  - TypeScript
  - Vite
  - shadcn-ui
  - Tailwind CSS
  - Lucide Icons

- **Backend**:
  - Python (FastAPI)
  - GeoJSON processing
  - Road data merging algorithms

## Getting Started

### Prerequisites

- Node.js & npm
- Python 3.8+

### Installation

1. Clone the repository:
```sh
git clone <repository-url>
cd here-hack/frontend
```

2. Install frontend dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

4. The application will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory:
```sh
cd ../backend
```

2. Install Python dependencies:
```sh
pip install -r requirements.txt
```

3. Start the backend server:
```sh
python main.py
```

The backend API will be available at `http://127.0.0.1:5000`

## API Endpoints

- `GET /merge-operations/list`: List all merge operations
- Additional endpoints for data merging and analysis

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Analyst/
│   │   │   └── MapView.tsx
│   │   └── Layout/
│   │       └── Header.tsx
│   ├── pages/
│   │   └── analyst.tsx
│   └── ...
├── public/
└── package.json

backend/
├── main.py
├── requirements.txt
└── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is part of the HERE Tech Hackathon and is subject to the hackathon's terms and conditions.
