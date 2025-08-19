import React, { useState, useRef } from "react";
import { imageService } from "../api/services/imageService";
import type { ImageUploadResponse, ImageUploadProgress } from "../api/services/imageService";

interface CoverImageUploadProps {
  onUploadComplete?: (imageData: ImageUploadResponse) => void;
  onUploadError?: (error: string) => void;
  currentCoverUrl?: string;
  className?: string;
}

interface UploadingFile {
  file: File;
  progress: ImageUploadProgress;
  status: "uploading" | "completed" | "error";
  error?: string;
  result?: ImageUploadResponse;
}

const CoverImageUpload: React.FC<CoverImageUploadProps> = ({ onUploadComplete, onUploadError, currentCoverUrl, className = "" }) => {
  const [uploadingFile, setUploadingFile] = useState<UploadingFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentCoverUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validate file
    const validation = imageService.validateImageFile(file);
    if (!validation.isValid) {
      onUploadError?.(validation.error || "Invalid file");
      return;
    }

    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Add to uploading file
    const uploadingFileData: UploadingFile = {
      file,
      progress: { loaded: 0, total: file.size, percentage: 0 },
      status: "uploading",
    };

    setUploadingFile(uploadingFileData);

    // Start upload
    imageService
      .uploadCoverImage(file, (progress) => {
        setUploadingFile((prev) => (prev ? { ...prev, progress } : null));
      })
      .then((result) => {
        setUploadingFile((prev) => (prev ? { ...prev, status: "completed", result } : null));

        // Update preview with actual URL
        setPreviewUrl(imageService.getCoverImageUrl(result.url));
        onUploadComplete?.(result);

        // Clean up object URL
        URL.revokeObjectURL(objectUrl);
      })
      .catch((error) => {
        const errorMessage = error.message || "Upload failed";
        setUploadingFile((prev) => (prev ? { ...prev, status: "error", error: errorMessage } : null));
        onUploadError?.(errorMessage);

        // Reset preview on error
        setPreviewUrl(currentCoverUrl || null);
        URL.revokeObjectURL(objectUrl);
      });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeUploadingFile = () => {
    setUploadingFile(null);
    setPreviewUrl(currentCoverUrl || null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`cover-image-upload ${className}`}>
      {/* Preview Area */}
      {previewUrl && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "14px", fontWeight: "500", marginBottom: "8px" }}>Cover Image Preview:</div>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "200px",
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid #e0e0e0",
            }}>
            <img
              src={previewUrl}
              alt="Cover preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {uploadingFile?.status === "uploading" && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "14px",
                }}>
                Uploading... {uploadingFile.progress.percentage}%
              </div>
            )}
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        className={`drop-zone ${isDragOver ? "drag-over" : ""}`}
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
        <div style={{ fontSize: "48px", marginBottom: "16px", color: "#ccc" }}>🖼️</div>
        <p style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "500" }}>{isDragOver ? "Drop cover image here" : "Click to upload cover image or drag and drop"}</p>
        <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>Single image • Max 10MB • JPEG, PNG, GIF, WebP</p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            handleFileSelect(files[0]);
          }
        }}
        style={{ display: "none" }}
      />

      {/* Upload Progress */}
      {uploadingFile && (
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "16px",
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
                  onClick={removeUploadingFile}
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
                <div>Cover image uploaded successfully!</div>
                <div style={{ marginTop: "4px", wordBreak: "break-all" }}>
                  <strong>URL:</strong> {imageService.getCoverImageUrl(uploadingFile.result.url)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverImageUpload;
