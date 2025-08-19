import React, { useState, useRef } from "react";
import { imageService } from "../api/services/imageService";
import type { ImageUploadResponse, ImageUploadProgress } from "../api/services/imageService";

interface ImageUploadProps {
  tripId?: number;
  onUploadComplete?: (imageData: ImageUploadResponse) => void;
  onUploadError?: (error: string) => void;
  multiple?: boolean;
  className?: string;
}

interface UploadingFile {
  file: File;
  progress: ImageUploadProgress;
  status: "uploading" | "completed" | "error";
  error?: string;
  result?: ImageUploadResponse;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ tripId, onUploadComplete, onUploadError, multiple = false, className = "" }) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const filesToProcess = multiple ? Array.from(files) : [files[0]];

    filesToProcess.forEach((file) => {
      // Validate file
      const validation = imageService.validateImageFile(file);
      if (!validation.isValid) {
        onUploadError?.(validation.error || "Invalid file");
        return;
      }

      // Add to uploading files list
      const uploadingFile: UploadingFile = {
        file,
        progress: { loaded: 0, total: file.size, percentage: 0 },
        status: "uploading",
      };

      setUploadingFiles((prev) => [...prev, uploadingFile]);

      // Start upload
      imageService
        .uploadImage(file, tripId, (progress) => {
          setUploadingFiles((prev) => prev.map((f) => (f.file === file ? { ...f, progress } : f)));
        })
        .then((result) => {
          setUploadingFiles((prev) => prev.map((f) => (f.file === file ? { ...f, status: "completed", result } : f)));
          onUploadComplete?.(result);
        })
        .catch((error) => {
          const errorMessage = error.message || "Upload failed";
          setUploadingFiles((prev) => prev.map((f) => (f.file === file ? { ...f, status: "error", error: errorMessage } : f)));
          onUploadError?.(errorMessage);
        });
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeUploadingFile = (file: File) => {
    setUploadingFiles((prev) => prev.filter((f) => f.file !== file));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`image-upload ${className}`}>
      {/* Drop Zone */}
      <div
        className={`drop-zone ${isDragOver ? "drag-over" : ""} ${uploadingFiles.length > 0 ? "has-files" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: "2px dashed #ccc",
          borderRadius: "8px",
          padding: "40px 20px",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: isDragOver ? "#f0f8ff" : "#fafafa",
          borderColor: isDragOver ? "#007bff" : "#ccc",
          transition: "all 0.3s ease",
        }}>
        <div style={{ fontSize: "48px", marginBottom: "16px", color: "#ccc" }}>📁</div>
        <p style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "500" }}>{isDragOver ? "Drop files here" : "Click to upload or drag and drop"}</p>
        <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>{multiple ? "Multiple images" : "Single image"} • Max 10MB • JPEG, PNG, GIF, WebP</p>
      </div>

      {/* Hidden File Input */}
      <input ref={fileInputRef} type="file" accept="image/*" multiple={multiple} onChange={(e) => handleFileSelect(e.target.files)} style={{ display: "none" }} />

      {/* Upload Progress List */}
      {uploadingFiles.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h4 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "500" }}>Upload Progress</h4>
          {uploadingFiles.map((uploadingFile, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "12px",
                backgroundColor: "#fff",
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div>
                  <div style={{ fontWeight: "500", fontSize: "14px" }}>{uploadingFile.file.name}</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>{formatFileSize(uploadingFile.file.size)}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {uploadingFile.status === "uploading" && <span style={{ fontSize: "12px", color: "#007bff" }}>{uploadingFile.progress.percentage}%</span>}
                  {uploadingFile.status === "completed" && <span style={{ fontSize: "12px", color: "#28a745" }}>✓ Complete</span>}
                  {uploadingFile.status === "error" && <span style={{ fontSize: "12px", color: "#dc3545" }}>✗ Failed</span>}
                  <button
                    onClick={() => removeUploadingFile(uploadingFile.file)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#666",
                      cursor: "pointer",
                      fontSize: "16px",
                      padding: "0",
                      width: "20px",
                      height: "20px",
                    }}>
                    ×
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              {uploadingFile.status === "uploading" && (
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}>
                  <div
                    style={{
                      width: `${uploadingFile.progress.percentage}%`,
                      height: "100%",
                      backgroundColor: "#007bff",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              )}

              {/* Error Message */}
              {uploadingFile.status === "error" && uploadingFile.error && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "8px",
                    backgroundColor: "#f8d7da",
                    color: "#721c24",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}>
                  {uploadingFile.error}
                </div>
              )}

              {/* Success Message with URL */}
              {uploadingFile.status === "completed" && uploadingFile.result && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "8px",
                    backgroundColor: "#d4edda",
                    color: "#155724",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}>
                  <div>Upload successful!</div>
                  <div style={{ marginTop: "4px", wordBreak: "break-all" }}>
                    <strong>URL:</strong> {imageService.getImageUrl(uploadingFile.result.url)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
