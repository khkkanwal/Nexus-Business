import React, { useEffect, useRef, useState } from "react";

import { FileText, Upload, Download, Trash2, Share2, Eye } from "lucide-react";

import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";

const API_URL = "http://localhost:5000/api/documents";

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // =========================
  // FETCH DOCUMENTS
  // =========================
  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setDocuments(data.documents || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // =========================
  // HANDLE FILE UPLOAD
  // =========================
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");

      return;
    }

    try {
      const formData = new FormData();

      // TITLE
      formData.append("title", selectedFile.name);

      // FILE
      formData.append("document", selectedFile);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/documents/upload", {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });

      const data = await res.json();

      console.log(data);

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert("Document uploaded successfully");

      setSelectedFile(null);

      fetchDocuments();
    } catch (error: any) {
      console.log(error);

      alert(error.message);
    }
  };

  // =========================
  // DELETE DOCUMENT
  // =========================
  const handleDelete = async (id: string) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this document?",
      );

      if (!confirmDelete) return;

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert("Document deleted successfully");

      fetchDocuments();
    } catch (error: any) {
      console.log(error);

      alert(error.message);
    }
  };

  // =========================
  // DOWNLOAD DOCUMENT
  // =========================
  const handleDownload = (fileUrl: string) => {
    window.open(`http://localhost:5000/${fileUrl}`, "_blank");
  };

  // =========================
  // PREVIEW DOCUMENT
  // =========================
  const handlePreview = (fileUrl: string) => {
    window.open(`http://localhost:5000/${fileUrl}`, "_blank");
  };

  // =========================
  // SHARE DOCUMENT
  // =========================
  const handleShare = async (fileUrl: string) => {
    const fullUrl = `http://localhost:5000/${fileUrl}`;

    try {
      await navigator.clipboard.writeText(fullUrl);

      alert("Document link copied to clipboard");
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // STORAGE CALCULATION
  // =========================
  const totalSize = documents.reduce((acc, doc) => {
    return acc + (doc.size || 0);
  }, 0);

  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>

          <p className="text-gray-600">Manage your startup's important files</p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0]);
              }
            }}
          />

          <Button
            leftIcon={<Upload size={18} />}
            onClick={() => {
              if (!selectedFile) {
                fileInputRef.current?.click();
              } else {
                handleUpload();
              }
            }}
          >
            {selectedFile ? "Upload Now" : "Select Document"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* STORAGE */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Storage</h2>
          </CardHeader>

          <CardBody className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Used</span>

                <span className="font-medium text-gray-900">
                  {totalSizeMB} MB
                </span>
              </div>

              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-primary-600 rounded-full"
                  style={{
                    width: `${Math.min(Number(totalSizeMB), 100)}%`,
                  }}
                />
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Documents</span>

                <span className="font-medium text-gray-900">
                  {documents.length}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* DOCUMENT LIST */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">
                All Documents
              </h2>
            </CardHeader>

            <CardBody>
              {loading ? (
                <p className="text-gray-500">Loading documents...</p>
              ) : documents.length === 0 ? (
                <p className="text-gray-500">No documents uploaded yet</p>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc._id}
                      className="flex items-center p-4 hover:bg-gray-50 rounded-xl border border-gray-100 transition"
                    >
                      {/* ICON */}
                      <div className="p-3 bg-primary-50 rounded-xl mr-4">
                        <FileText size={24} className="text-primary-600" />
                      </div>

                      {/* INFO */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {doc.originalName}
                          </h3>

                          <Badge>{doc.status || "active"}</Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-500">
                          <span>
                            {(doc.size / (1024 * 1024)).toFixed(2)} MB
                          </span>

                          <span>
                            Uploaded by: {doc.uploadedBy?.name || "Unknown"}
                          </span>

                          <span>
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex items-center gap-2 ml-4">
                        {/* PREVIEW */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2"
                          onClick={() => handlePreview(doc.fileUrl)}
                        >
                          <Eye size={18} />
                        </Button>

                        {/* DOWNLOAD */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2"
                          onClick={() => handleDownload(doc.fileUrl)}
                        >
                          <Download size={18} />
                        </Button>

                        {/* SHARE */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2"
                          onClick={() => handleShare(doc.fileUrl)}
                        >
                          <Share2 size={18} />
                        </Button>

                        {/* DELETE */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(doc._id)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
