"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shield, Search, Download, Eye, User, Database, FileText, Settings, AlertTriangle } from "lucide-react"

interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  resource: string
  details: string
  ipAddress: string
  userAgent: string
  severity: "info" | "warning" | "error" | "critical"
  caseId?: string
}

export default function AuditPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [filterAction, setFilterAction] = useState("all")
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  const auditLogs: AuditLog[] = [
    {
      id: "audit_001",
      timestamp: "2025-01-15T14:30:00Z",
      userId: "user_001",
      userName: "Dr. Sarah Johnson",
      action: "REPORT_SIGNED",
      resource: "Report rpt_001",
      details: "Digitally signed forensic report for CASE-2025-001",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "info",
      caseId: "CASE-2025-001",
    },
    {
      id: "audit_002",
      timestamp: "2025-01-15T13:45:00Z",
      userId: "user_002",
      userName: "John Smith",
      action: "QUERY_EXECUTED",
      resource: "NLQ Console",
      details: "Executed Cypher query: MATCH (p:Person)-[:OWNS]->(d:Device) RETURN p, d",
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0 (macOS; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      severity: "info",
      caseId: "CASE-2025-001",
    },
    {
      id: "audit_003",
      timestamp: "2025-01-15T12:20:00Z",
      userId: "user_001",
      userName: "Dr. Sarah Johnson",
      action: "FILE_UPLOADED",
      resource: "UFDR File",
      details: "Uploaded ufdr_001.ufdr (SHA256: sha256_a1b2c3d4e5f6)",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "info",
      caseId: "CASE-2025-001",
    },
    {
      id: "audit_004",
      timestamp: "2025-01-15T11:15:00Z",
      userId: "user_003",
      userName: "Mike Wilson",
      action: "LOGIN_FAILED",
      resource: "Authentication System",
      details: "Failed login attempt - invalid credentials",
      ipAddress: "203.0.113.45",
      userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
      severity: "warning",
    },
    {
      id: "audit_005",
      timestamp: "2025-01-15T10:30:00Z",
      userId: "user_002",
      userName: "John Smith",
      action: "GRAPH_ACCESSED",
      resource: "Graph Explorer",
      details: "Accessed graph visualization for CASE-2025-001",
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0 (macOS; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      severity: "info",
      caseId: "CASE-2025-001",
    },
    {
      id: "audit_006",
      timestamp: "2025-01-15T09:45:00Z",
      userId: "system",
      userName: "System",
      action: "PARSER_ERROR",
      resource: "UFDR Parser",
      details: "Failed to parse call_records.json - invalid JSON format",
      ipAddress: "127.0.0.1",
      userAgent: "UFDR-Parser/v0.1.0",
      severity: "error",
      caseId: "CASE-2025-003",
    },
    {
      id: "audit_007",
      timestamp: "2025-01-15T08:30:00Z",
      userId: "user_001",
      userName: "Dr. Sarah Johnson",
      action: "LOGIN_SUCCESS",
      resource: "Authentication System",
      details: "Successful login with MFA verification",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "info",
    },
    {
      id: "audit_008",
      timestamp: "2025-01-14T23:45:00Z",
      userId: "admin",
      userName: "System Administrator",
      action: "SYSTEM_BACKUP",
      resource: "Database",
      details: "Automated system backup completed successfully",
      ipAddress: "127.0.0.1",
      userAgent: "BackupService/v1.0",
      severity: "info",
    },
  ]

  const getSeverityIcon = (severity: AuditLog["severity"]) => {
    switch (severity) {
      case "info":
        return <Shield className="h-4 w-4 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
    }
  }

  const getSeverityBadge = (severity: AuditLog["severity"]) => {
    const colors = {
      info: "bg-blue-500/10 text-blue-500",
      warning: "bg-yellow-500/10 text-yellow-500",
      error: "bg-red-500/10 text-red-500",
      critical: "bg-red-600/10 text-red-600",
    }

    return (
      <Badge className={colors[severity]} variant="secondary">
        {severity.toUpperCase()}
      </Badge>
    )
  }

  const getActionIcon = (action: string) => {
    if (action.includes("LOGIN") || action.includes("AUTH")) return <User className="h-4 w-4" />
    if (action.includes("QUERY") || action.includes("GRAPH")) return <Database className="h-4 w-4" />
    if (action.includes("REPORT") || action.includes("FILE")) return <FileText className="h-4 w-4" />
    return <Settings className="h-4 w-4" />
  }

  const filteredLogs = auditLogs.filter((log) => {
    if (filterSeverity !== "all" && log.severity !== filterSeverity) return false
    if (filterAction !== "all" && !log.action.toLowerCase().includes(filterAction.toLowerCase())) return false
    if (searchQuery && !log.details.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
                <p className="text-muted-foreground">System activity monitoring and security audit trail</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Logs
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{filteredLogs.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Warnings</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-500">
                    {filteredLogs.filter((l) => l.severity === "warning").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Errors</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">
                    {filteredLogs.filter((l) => l.severity === "error" || l.severity === "critical").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{new Set(filteredLogs.map((l) => l.userId)).size}</div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filter Audit Logs</CardTitle>
                <CardDescription>Search and filter system audit events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search audit logs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterAction} onValueChange={setFilterAction}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="login">Login Events</SelectItem>
                      <SelectItem value="query">Query Events</SelectItem>
                      <SelectItem value="file">File Events</SelectItem>
                      <SelectItem value="report">Report Events</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Audit Logs Table */}
            <Card>
              <CardHeader>
                <CardTitle>System Audit Trail</CardTitle>
                <CardDescription>Chronological record of all system activities and security events</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Case ID</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.map((log) => (
                        <TableRow key={log.id} className="cursor-pointer hover:bg-accent/50">
                          <TableCell className="font-mono text-sm">
                            {new Date(log.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{log.userName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getActionIcon(log.action)}
                              <span className="font-mono text-sm">{log.action}</span>
                            </div>
                          </TableCell>
                          <TableCell>{log.resource}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getSeverityIcon(log.severity)}
                              {getSeverityBadge(log.severity)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {log.caseId ? (
                              <Badge variant="outline" className="font-mono text-xs">
                                {log.caseId}
                              </Badge>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Log Details */}
            {selectedLog && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Audit Log Details</span>
                  </CardTitle>
                  <CardDescription>Detailed information for audit event {selectedLog.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm">Event ID</h4>
                        <p className="text-sm font-mono text-muted-foreground">{selectedLog.id}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Timestamp</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedLog.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">User</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedLog.userName} ({selectedLog.userId})
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Action</h4>
                        <p className="text-sm font-mono text-muted-foreground">{selectedLog.action}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Resource</h4>
                        <p className="text-sm text-muted-foreground">{selectedLog.resource}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm">Severity</h4>
                        <div className="flex items-center space-x-2">
                          {getSeverityIcon(selectedLog.severity)}
                          {getSeverityBadge(selectedLog.severity)}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">IP Address</h4>
                        <p className="text-sm font-mono text-muted-foreground">{selectedLog.ipAddress}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">User Agent</h4>
                        <p className="text-sm text-muted-foreground break-all">{selectedLog.userAgent}</p>
                      </div>
                      {selectedLog.caseId && (
                        <div>
                          <h4 className="font-medium text-sm">Case ID</h4>
                          <Badge variant="outline" className="font-mono">
                            {selectedLog.caseId}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium text-sm mb-2">Details</h4>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">{selectedLog.details}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
