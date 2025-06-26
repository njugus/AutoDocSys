import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './InvoiceUpload.css';  

function InvoiceApp() {
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    //create a new form object
    const formData = new FormData();
    formData.append('invoice', file);
    //{ invoice:file }

    try {
      setLoading(true);
      setError(null);
      
      // Send to Node.js backend
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setExtractedData(response.data);
    } catch (err) {
      setError('Failed to process invoice. Try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'application/pdf',
    maxFiles: 1,
  });

  return (
    <div className="app-container">
      <div className="invoice-uploader">
        <h1>Upload Your Invoice</h1>
        
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
        >
          <input {...getInputProps()} />
          <p>
            {isDragActive
              ? 'Drop the invoice PDF here'
              : 'Drag/drop a PDF invoice, or click to select'}
          </p>
        </div>

        {/* Loading/Error States */}
        {loading && <p className="loading-message">Processing invoice...</p>}
        {error && <p className="error-message">{error}</p>}

        {/* Extracted Data */}
        {extractedData && (
          <div className="extracted-data">
            <h2>Extracted Data</h2>
            <pre>{JSON.stringify(extractedData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvoiceApp;