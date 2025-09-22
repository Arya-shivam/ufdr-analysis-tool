"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, Clock, AlertCircle, Database, FileText, Hash, Calendar, Download, Eye } from "lucide-react"

interface ParseJob {
  jobId: string
  caseId: string
  fileName: string
  inputHash: string
  parserVersion: string
  status: "queued" | "parsing" | "completed" | "error"
  progress: number
  startTime: string
  endTime?: string
  graphJsonUrl?: string
  errorMessage?: string
  entitiesFound: number
  relationshipsFound: number
}

export default function ParseStatusPage() {
  const [jobs, setJobs] = useState<ParseJob[]>([
    {
      jobId: "job_abc123",
      caseId: "CASE-2025-001",
      fileName: "ufdr_001.ufdr",
      inputHash: "sha256_a1b2c3d4e5f6",
      parserVersion: "v0.1.0",
      status: "completed",
      progress: 100,
      startTime: "2025-01-15T10:30:00Z",
      endTime: "2025-01-15T10:32:15Z",
      graphJsonUrl: "/api/graph/job_abc123.json",
      entitiesFound: 1247,
      relationshipsFound: 3891,
    },
    {
      jobId: "job_def456",
      caseId: "CASE-2025-002",
      fileName: "mobile_data.ufd",
      inputHash: "sha256_f6e5d4c3b2a1",
      parserVersion: "v0.1.0",
      status: "parsing",
      progress: 65,
      startTime: "2025-01-15T11:15:00Z",
      entitiesFound: 892,
      relationshipsFound: 2156,
    },
    {
      jobId: "job_ghi789",
      caseId: "CASE-2025-003",
      fileName: "call_records.json",
      inputHash: "sha256_123456789abc",
      parserVersion: "v0.1.0",
      status: "error",
      progress: 0,
      startTime: "2025-01-15T11:45:00Z",
      errorMessage: "Invalid JSON format detected in source file",
      entitiesFound: 0,
      relationshipsFound: 0,
    },
  ])

  const [selectedJob, setSelectedJob] = useState<ParseJob | null>(null)

  useEffect(() => {
    // Simulate real-time updates for parsing jobs
    const interval = setInterval(() => {
      setJobs((prevJobs) =>
        prevJobs.map((job) => {
          if (job.status === "parsing" && job.progress < 100) {
            const newProgress = Math.min(job.progress + Math.random() * 10, 100)
            const updatedJob = { ...job, progress: newProgress }

            if (newProgress >= 100) {
              updatedJob.status = "completed"
              updatedJob.endTime = new Date().toISOString()
              updatedJob.graphJsonUrl = `/api/graph/${job.jobId}.json`
            }

            return updatedJob
          }
          return job
        }),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: ParseJob["status"]) => {
    switch (status) {
      case "queued":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "parsing":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: ParseJob["status"]) => {
    const variants = {
      queued: "secondary",
      parsing: "secondary",
      completed: "default",
      error: "destructive",
    } as const

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    )
  }

  const formatDuration = (start: string, end?: string) => {
    const startTime = new Date(start)
    const endTime = end ? new Date(end) : new Date()
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)

    if (duration < 60) return `${duration}s`
    if (duration < 3600) return `${Math.floor(duration / 60)}m ${duration % 60}s`
    return `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m`
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Parse Status</h1>
              <p className="text-muted-foreground">Monitor UFDR file parsing progress and view processing results</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{jobs.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">
                    {jobs.filter((j) => j.status === "completed").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Processing</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">
                    {jobs.filter((j) => j.status === "parsing" || j.status === "queued").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Errors</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">
                    {jobs.filter((j) => j.status === "error").length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Jobs Table */}
            <Card>
              <CardHeader>
                <CardTitle>Processing Jobs</CardTitle>
                <CardDescription>Real-time status of UFDR parsing operations</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job ID</TableHead>
                      <TableHead>Case ID</TableHead>
                      <TableHead>File Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Entities</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.map((job) => (
                      <TableRow key={job.jobId}>
                        <TableCell className="font-mono text-sm">{job.jobId}</TableCell>
                        <TableCell className="font-medium">{job.caseId}</TableCell>
                        <TableCell>{job.fileName}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(job.status)}
                            {getStatusBadge(job.status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {job.status === "parsing" ? (
                            <div className="space-y-1">
                              <Progress value={job.progress} className="w-20" />
                              <span className="text-xs text-muted-foreground">{Math.round(job.progress)}%</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {job.status === "completed" ? "100%" : "-"}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{formatDuration(job.startTime, job.endTime)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{job.entitiesFound.toLocaleString()}</div>
                            <div className="text-muted-foreground text-xs">
                              {job.relationshipsFound.toLocaleString()} relations
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedJob(job)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {job.graphJsonUrl && (
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Job Details */}
            {selectedJob && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>Job Details: {selectedJob.jobId}</span>
                  </CardTitle>
                  <CardDescription>Detailed information about the parsing job</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Case ID</Label>
                        <p className="text-sm text-muted-foreground">{selectedJob.caseId}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">File Name</Label>
                        <p className="text-sm text-muted-foreground">{selectedJob.fileName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Input Hash</Label>
                        <p className="text-sm font-mono text-muted-foreground flex items-center space-x-1">
                          <Hash className="h-3 w-3" />
                          <span>{selectedJob.inputHash}</span>
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Parser Version</Label>
                        <p className="text-sm text-muted-foreground">{selectedJob.parserVersion}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Start Time</Label>
                        <p className="text-sm text-muted-foreground flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(selectedJob.startTime).toLocaleString()}</span>
                        </p>
                      </div>
                      {selectedJob.endTime && (
                        <div>
                          <Label className="text-sm font-medium">End Time</Label>
                          <p className="text-sm text-muted-foreground flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(selectedJob.endTime).toLocaleString()}</span>
                          </p>
                        </div>
                      )}
                      <div>
                        <Label className="text-sm font-medium">Entities Found</Label>
                        <p className="text-sm text-muted-foreground">{selectedJob.entitiesFound.toLocaleString()}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Relationships Found</Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedJob.relationshipsFound.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedJob.errorMessage && (
                    <Alert className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Error:</strong> {selectedJob.errorMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  {selectedJob.graphJsonUrl && (
                    <div className="mt-4 flex space-x-2">
                      <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Download Graph JSON
                      </Button>
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View in Graph Explorer
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}
