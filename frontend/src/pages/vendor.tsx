import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/Header';
import { FileUpload } from '@/components/Vendor/FileUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const API_BASE = "http://127.0.0.1:5000/geojson";
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
});

async function uploadGeoJSON({ name, vendor_name, geojson_data }: any) {
  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, vendor_name, geojson_data }),
  });
  return res.json();
}

async function listGeoJSON() {
  const res = await fetch(`${API_BASE}/list`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

async function fetchGeoJSON(id: number) {
  const res = await fetch(`${API_BASE}/fetch/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

async function createGeoJSON({ name, vendor_name, features }: any) {
  const res = await fetch(`${API_BASE}/create`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, vendor_name, features }),
  });
  return res.json();
}

async function updateGeoJSON(id: number, { name, vendor_name, geojson_data }: any) {
  const res = await fetch(`${API_BASE}/update/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, vendor_name, geojson_data }),
  });
  return res.json();
}

async function deleteGeoJSON(id: number) {
  const res = await fetch(`${API_BASE}/delete/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return res.json();
}

const VendorDashboard = () => {
  const [geojsonList, setGeojsonList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedGeojson, setSelectedGeojson] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);

  const refreshList = () => {
    setLoading(true);
    listGeoJSON()
      .then((res) => {
        if (res.success) setGeojsonList(res.data);
        else setError(res.message || "Failed to fetch GeoJSON list");
      })
      .catch(() => setError("Failed to fetch GeoJSON list"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshList();
  }, []);

  const handleFileUpload = async (file: File, geojsonData: any) => {
    const name = file.name;
    const vendor_name = localStorage.getItem("userName") || "Unknown Vendor";
    const res = await uploadGeoJSON({ name, vendor_name, geojson_data: geojsonData });
    if (res.success) {
      refreshList();
    } else {
      setError(res.message || "Upload failed");
    }
  };

  const handleFetch = async (id: number) => {
    setSelectedId(id);
    setSelectedGeojson(null);
    const res = await fetchGeoJSON(id);
    if (res.success) {
      setSelectedGeojson(res.data);
    } else {
      setError(res.message || "Fetch failed");
    }
  };

  const handleDelete = async (id: number) => {
    const res = await deleteGeoJSON(id);
    if (res.success) {
      refreshList();
      if (selectedId === id) setSelectedGeojson(null);
    } else {
      setError(res.message || "Delete failed");
    }
  };
  
  const handleUpdate = async (id: number, updates: any) => {
    setUpdating(true);
    const res = await updateGeoJSON(id, updates);
    setUpdating(false);
    if (res.success) {
      refreshList();
      if (selectedId === id) handleFetch(id);
    } else {
      setError(res.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="vendor" />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Dashboard</h1>
          <p className="text-gray-600">Upload and manage your geospatial data files</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span>Upload Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Files</span>
                    <Badge variant="secondary">{geojsonList.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Processing Status</span>
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ready
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Uploaded GeoJSON Files</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div>Loading...</div>
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : (
                  <ul>
                    {geojsonList.map((item) => (
                      <li key={item.id} className="mb-2 flex items-center gap-2">
                        <span className="font-semibold cursor-pointer underline" onClick={() => handleFetch(item.id)}>{item.name}</span>
                        <span className="text-xs text-gray-500">({item.size} bytes) - {item.vendor_name} - {item.date_added}</span>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>Delete</Button>
                        <Button size="sm" variant="outline" onClick={() => handleFetch(item.id)}>View</Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {selectedGeojson && (
              <Card>
                <CardHeader>
                  <CardTitle>GeoJSON Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div><b>ID:</b> {selectedGeojson.id}</div>
                    <div><b>Name:</b> {selectedGeojson.name}</div>
                    <div><b>Vendor:</b> {selectedGeojson.vendor_name}</div>
                    <div><b>Date Added:</b> {selectedGeojson.date_added}</div>
                    <div><b>Size:</b> {selectedGeojson.size} bytes</div>
                    <div><b>GeoJSON:</b>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-48">{JSON.stringify(selectedGeojson.geojson_data, null, 2)}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Processing Pipeline</CardTitle>
                <CardDescription>Universal parser workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>File Validation</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Data Parsing</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Quality Check</span>
                      <span>72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
