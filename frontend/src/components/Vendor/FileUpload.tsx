
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const supportedFormats = [
  { type: 'geojson', description: 'GeoJSON format for geographic data', status: 'active' },
  { type: 'pbf', description: 'Protocol Buffer format', status: 'dummy' },
  { type: 'jpeg', description: 'JPEG image format', status: 'dummy' }
];

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            setUploadedFiles(prev => [...prev, file.name]);
            onFileUpload(file);
            toast.success('File uploaded successfully!');
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.geojson', '.json'],
      'application/octet-stream': ['.pbf'],
      'image/jpeg': ['.jpeg', '.jpg']
    },
    maxFiles: 1
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-orange-500" />
            <span>Upload Geospatial Data</span>
          </CardTitle>
          <CardDescription>
            Upload your geospatial data files for processing and analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-orange-500'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-blue-600 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-white" />
              </div>
              {isDragActive ? (
                <p className="text-blue-600 font-medium">Drop the file here...</p>
              ) : (
                <>
                  <p className="text-gray-600">
                    Drag & drop your file here, or <span className="text-orange-600 font-medium">browse</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports GeoJSON, PBF, and JPEG formats
                  </p>
                </>
              )}
            </div>
          </div>

          {isUploading && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supported Formats</CardTitle>
          <CardDescription>File formats available for upload</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {supportedFormats.map((format) => (
              <div key={format.type} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <File className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium uppercase">{format.type}</p>
                    <p className="text-sm text-gray-600">{format.description}</p>
                  </div>
                </div>
                {format.status === 'active' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <div className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                    Demo Only
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uploadedFiles.map((fileName, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{fileName}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
