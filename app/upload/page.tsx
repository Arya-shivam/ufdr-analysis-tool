"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle, AlertCircle, Clock, Hash } from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "uploaded" | "parsing" | "completed" | "error"
  progress: number
  hash?: string
  caseId?: string
  jobId?: string
  error?: string
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [caseId, setCaseId] = useState("")
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      status: "uploading",
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate upload process
    newFiles.forEach((file) => {
      simulateUpload(file.id)
    })
  }

  const simulateUpload = async (fileId: string) => {
    const updateFile = (updates: Partial<UploadedFile>) => {
      setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, ...updates } : f)))
    }

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      updateFile({ progress })
    }

    // Upload completed
    const hash = `sha256_${Math.random().toString(36).substr(2, 16)}`
    const jobId = `job_${Math.random().toString(36).substr(2, 8)}`
    updateFile({
      status: "uploaded",
      hash,
      jobId,
      caseId: caseId || `CASE-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
    })

    // Start parsing
    await new Promise((resolve) => setTimeout(resolve, 500))
    updateFile({ status: "parsing" })

    // Complete parsing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    updateFile({ status: "completed" })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "uploaded":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "parsing":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: UploadedFile["status"]) => {
    const variants = {
      uploading: "secondary",
      uploaded: "secondary",
      parsing: "secondary",
      completed: "default",
      error: "destructive",
    } as const

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status === "parsing" ? "Parsing" : status}
      </Badge>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Upload UFDR Files</h1>
              <p className="text-muted-foreground">
                Upload Universal Forensic Data Reader files for analysis and processing
              </p>
            </div>

            {/* Case ID Input */}
            <Card>
              <CardHeader>
                <CardTitle>Case Information</CardTitle>
                <CardDescription>Specify case details for proper data organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="caseId">Case ID (Optional)</Label>
                    <Input
                      id="caseId"
                      placeholder="CASE-2025-001"
                      value={caseId}
                      onChange={(e) => setCaseId(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Leave empty to auto-generate case ID</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle>File Upload</CardTitle>
                <CardDescription>
                  Drag and drop UFDR files or click to browse. Supported formats: .ufdr, .ufd, .json
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Drop files here</h3>
                  <p className="text-muted-foreground mb-4">or click to browse your computer</p>
                  <Button onClick={() => document.getElementById("file-input")?.click()} className="mb-2">
                    Browse Files
                  </Button>
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    accept=".ufdr,.ufd,.json"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  />
                  <p className="text-xs text-muted-foreground">Maximum file size: 500MB per file</p>
                </div>
              </CardContent>
            </Card>

            {/* Demo Data Alert */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Demo Environment:</strong> This system uses synthetic data only. No real UFDR files are
                processed. All uploaded files are simulated for demonstration purposes.
              </AlertDescription>
            </Alert>

            {/* File List */}
            {files.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Progress</CardTitle>
                  <CardDescription>Monitor file upload and parsing status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          {getStatusIcon(file.status)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{file.name}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{formatFileSize(file.size)}</span>
                              {file.hash && (
                                <span className="flex items-center space-x-1">
                                  <Hash className="h-3 w-3" />
                                  <span className="font-mono text-xs">{file.hash}</span>
                                </span>
                              )}
                              {file.caseId && <span>Case: {file.caseId}</span>}
                              {file.jobId && <span>Job: {file.jobId}</span>}
                            </div>
                            {file.status === "uploading" && <Progress value={file.progress} className="mt-2" />}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">{getStatusBadge(file.status)}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Processing Information */}
            <Card>
              <CardHeader>
                <CardTitle>Processing Pipeline</CardTitle>
                <CardDescription>Understanding the UFDR analysis workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">1. Upload & Hash</h3>
                    <p className="text-sm text-muted-foreground">
                      Files are uploaded and SHA-256 hashed for integrity verification
                    </p>
                  </div>

                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="h-6 w-6 text-chart-2" />
                    </div>
                    <h3 className="font-medium mb-2">2. Parse & Extract</h3>
                    <p className="text-sm text-muted-foreground">
                      UFDR data is parsed and converted to structured JSON format
                    </p>
                  </div>

                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-chart-3/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6 text-chart-3" />
                    </div>
                    <h3 className="font-medium mb-2">3. Graph Import</h3>
                    <p className="text-sm text-muted-foreground">
                      Structured data is imported into Neo4j graph database
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
