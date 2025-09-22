"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label as LabelComponent } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Download, Eye, Shield, Calendar, User, Hash, CheckCircle, Clock, Plus } from "lucide-react"

interface ReportSection {
  id: string
  title: string
  content: string
  included: boolean
  required: boolean
}

interface GeneratedReport {
  id: string
  caseId: string
  title: string
  status: "draft" | "generating" | "completed" | "signed"
  createdAt: string
  signedAt?: string
  signer?: string
  sections: string[]
  inputHash: string
  parserVersion: string
  toolVersion: string
  signature?: string
  pdfUrl?: string
  jsonUrl?: string
}

export default function ReportsPage() {
  const [selectedCase, setSelectedCase] = useState("CASE-2025-001")
  const [reportTitle, setReportTitle] = useState("")
  const [signerName, setSignerName] = useState("Dr. Sarah Johnson")
  const [signerRole, setSignerRole] = useState("Senior Forensic Analyst")
  const [executiveSummary, setExecutiveSummary] = useState("")

  const [reportSections, setReportSections] = useState<ReportSection[]>([
    {
      id: "executive_summary",
      title: "Executive Summary",
      content: "High-level overview of findings and conclusions",
      included: true,
      required: true,
    },
    {
      id: "case_details",
      title: "Case Details",
      content: "Case identification, timeline, and scope",
      included: true,
      required: true,
    },
    {
      id: "data_sources",
      title: "Data Sources",
      content: "UFDR files processed and data provenance",
      included: true,
      required: true,
    },
    {
      id: "methodology",
      title: "Methodology",
      content: "Analysis techniques and tools used",
      included: true,
      required: false,
    },
    {
      id: "communication_analysis",
      title: "Communication Analysis",
      content: "Call records, messages, and communication patterns",
      included: true,
      required: false,
    },
    {
      id: "location_analysis",
      title: "Location Analysis",
      content: "Movement patterns and location intelligence",
      included: false,
      required: false,
    },
    {
      id: "network_analysis",
      title: "Network Analysis",
      content: "Relationship mapping and social network analysis",
      included: true,
      required: false,
    },
    {
      id: "timeline_analysis",
      title: "Timeline Analysis",
      content: "Chronological sequence of events",
      included: true,
      required: false,
    },
    {
      id: "technical_details",
      title: "Technical Details",
      content: "Parser versions, hashes, and technical metadata",
      included: true,
      required: true,
    },
    {
      id: "conclusions",
      title: "Conclusions",
      content: "Key findings and recommendations",
      included: true,
      required: true,
    },
  ])

  const [generatedReports] = useState<GeneratedReport[]>([
    {
      id: "rpt_001",
      caseId: "CASE-2025-001",
      title: "Comprehensive Forensic Analysis Report",
      status: "signed",
      createdAt: "2025-01-15T10:00:00Z",
      signedAt: "2025-01-15T14:30:00Z",
      signer: "Dr. Sarah Johnson",
      sections: ["executive_summary", "case_details", "communication_analysis", "conclusions"],
      inputHash: "sha256_a1b2c3d4e5f6",
      parserVersion: "v0.1.0",
      toolVersion: "v0.1.0",
      signature: "base64_signature_data_here",
      pdfUrl: "/reports/rpt_001.pdf",
      jsonUrl: "/reports/rpt_001.json",
    },
    {
      id: "rpt_002",
      caseId: "CASE-2025-002",
      title: "Mobile Device Analysis Summary",
      status: "completed",
      createdAt: "2025-01-15T11:30:00Z",
      signer: "Dr. Sarah Johnson",
      sections: ["executive_summary", "case_details", "technical_details"],
      inputHash: "sha256_f6e5d4c3b2a1",
      parserVersion: "v0.1.0",
      toolVersion: "v0.1.0",
      pdfUrl: "/reports/rpt_002.pdf",
      jsonUrl: "/reports/rpt_002.json",
    },
    {
      id: "rpt_003",
      caseId: "CASE-2025-001",
      title: "Location Intelligence Report",
      status: "generating",
      createdAt: "2025-01-15T13:15:00Z",
      signer: "Dr. Sarah Johnson",
      sections: ["executive_summary", "location_analysis", "timeline_analysis"],
      inputHash: "sha256_a1b2c3d4e5f6",
      parserVersion: "v0.1.0",
      toolVersion: "v0.1.0",
    },
  ])

  const toggleSection = (sectionId: string) => {
    setReportSections((prev) =>
      prev.map((section) =>
        section.id === sectionId && !section.required ? { ...section, included: !section.included } : section,
      ),
    )
  }

  const generateReport = () => {
    const includedSections = reportSections.filter((s) => s.included).map((s) => s.id)
    console.log("Generating report with sections:", includedSections)
    console.log("Report title:", reportTitle)
    console.log("Signer:", signerName, signerRole)
    console.log("Executive summary:", executiveSummary)
    // Here you would typically call an API to generate the report
  }

  const getStatusIcon = (status: GeneratedReport["status"]) => {
    switch (status) {
      case "draft":
        return <FileText className="h-4 w-4 text-gray-500" />
      case "generating":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "signed":
        return <Shield className="h-4 w-4 text-primary" />
    }
  }

  const getStatusBadge = (status: GeneratedReport["status"]) => {
    const variants = {
      draft: "secondary",
      generating: "secondary",
      completed: "default",
      signed: "default",
    } as const

    const colors = {
      draft: "bg-gray-500/10 text-gray-500",
      generating: "bg-blue-500/10 text-blue-500",
      completed: "bg-green-500/10 text-green-500",
      signed: "bg-primary/10 text-primary",
    }

    return (
      <Badge className={colors[status]} variant="secondary">
        {status === "signed" ? "Digitally Signed" : status}
      </Badge>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Report Builder</h1>
              <p className="text-muted-foreground">
                Generate comprehensive forensic analysis reports with digital signatures
              </p>
            </div>

            <Tabs defaultValue="builder" className="space-y-6">
              <TabsList>
                <TabsTrigger value="builder">Report Builder</TabsTrigger>
                <TabsTrigger value="history">Report History</TabsTrigger>
              </TabsList>

              <TabsContent value="builder" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Report Configuration */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Report Configuration</CardTitle>
                        <CardDescription>Configure report details and metadata</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <LabelComponent htmlFor="case-id">Case ID</LabelComponent>
                            <Select value={selectedCase} onValueChange={setSelectedCase}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CASE-2025-001">CASE-2025-001</SelectItem>
                                <SelectItem value="CASE-2025-002">CASE-2025-002</SelectItem>
                                <SelectItem value="CASE-2025-003">CASE-2025-003</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <LabelComponent htmlFor="report-title">Report Title</LabelComponent>
                            <Input
                              id="report-title"
                              placeholder="Comprehensive Forensic Analysis Report"
                              value={reportTitle}
                              onChange={(e) => setReportTitle(e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <LabelComponent htmlFor="executive-summary">Executive Summary</LabelComponent>
                          <Textarea
                            id="executive-summary"
                            placeholder="Provide a high-level overview of the case and key findings..."
                            value={executiveSummary}
                            onChange={(e) => setExecutiveSummary(e.target.value)}
                            rows={4}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <LabelComponent htmlFor="signer-name">Digital Signer Name</LabelComponent>
                            <Input
                              id="signer-name"
                              value={signerName}
                              onChange={(e) => setSignerName(e.target.value)}
                            />
                          </div>

                          <div>
                            <LabelComponent htmlFor="signer-role">Signer Role</LabelComponent>
                            <Input
                              id="signer-role"
                              value={signerRole}
                              onChange={(e) => setSignerRole(e.target.value)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Report Sections */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Report Sections</CardTitle>
                        <CardDescription>Select sections to include in the forensic report</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-64">
                          <div className="space-y-3">
                            {reportSections.map((section) => (
                              <div
                                key={section.id}
                                className="flex items-start space-x-3 p-3 border border-border rounded-lg"
                              >
                                <Checkbox
                                  id={section.id}
                                  checked={section.included}
                                  onCheckedChange={() => toggleSection(section.id)}
                                  disabled={section.required}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2">
                                    <LabelComponent htmlFor={section.id} className="font-medium">
                                      {section.title}
                                    </LabelComponent>
                                    {section.required && (
                                      <Badge variant="outline" className="text-xs">
                                        Required
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">{section.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Report Preview */}
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Eye className="h-5 w-5" />
                          <span>Report Preview</span>
                        </CardTitle>
                        <CardDescription>Preview of the generated report structure</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-sm">Report Title</h4>
                            <p className="text-sm text-muted-foreground">{reportTitle || "Untitled Report"}</p>
                          </div>

                          <div>
                            <h4 className="font-medium text-sm">Case ID</h4>
                            <p className="text-sm text-muted-foreground">{selectedCase}</p>
                          </div>

                          <div>
                            <h4 className="font-medium text-sm">Included Sections</h4>
                            <div className="space-y-1">
                              {reportSections
                                .filter((s) => s.included)
                                .map((section, index) => (
                                  <div key={section.id} className="text-sm text-muted-foreground">
                                    {index + 1}. {section.title}
                                  </div>
                                ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-sm">Digital Signer</h4>
                            <p className="text-sm text-muted-foreground">
                              {signerName}
                              <br />
                              <span className="text-xs">{signerRole}</span>
                            </p>
                          </div>

                          <Alert>
                            <Shield className="h-4 w-4" />
                            <AlertDescription>
                              Report will be digitally signed with SHA-256 hash verification and timestamp.
                            </AlertDescription>
                          </Alert>

                          <Button onClick={generateReport} className="w-full" disabled={!reportTitle.trim()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Generate Report
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Reports</CardTitle>
                    <CardDescription>History of forensic reports generated by the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {generatedReports.map((report) => (
                        <div key={report.id} className="p-4 border border-border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(report.status)}
                              <div>
                                <h3 className="font-medium">{report.title}</h3>
                                <p className="text-sm text-muted-foreground">Case: {report.caseId}</p>
                              </div>
                            </div>
                            {getStatusBadge(report.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="flex items-center space-x-1 text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>Created: {new Date(report.createdAt).toLocaleDateString()}</span>
                              </div>
                              {report.signedAt && (
                                <div className="flex items-center space-x-1 text-muted-foreground">
                                  <Shield className="h-3 w-3" />
                                  <span>Signed: {new Date(report.signedAt).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>

                            <div>
                              <div className="flex items-center space-x-1 text-muted-foreground">
                                <User className="h-3 w-3" />
                                <span>{report.signer}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-muted-foreground">
                                <Hash className="h-3 w-3" />
                                <span className="font-mono text-xs">{report.inputHash}</span>
                              </div>
                            </div>

                            <div>
                              <p className="text-muted-foreground">Sections: {report.sections.length}</p>
                              <p className="text-muted-foreground">Tool: {report.toolVersion}</p>
                            </div>
                          </div>

                          <div className="flex space-x-2 mt-4">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              Preview
                            </Button>
                            {report.pdfUrl && (
                              <Button variant="outline" size="sm">
                                <Download className="h-3 w-3 mr-1" />
                                PDF
                              </Button>
                            )}
                            {report.jsonUrl && (
                              <Button variant="outline" size="sm">
                                <Download className="h-3 w-3 mr-1" />
                                JSON
                              </Button>
                            )}
                            {report.status === "completed" && (
                              <Button size="sm">
                                <Shield className="h-3 w-3 mr-1" />
                                Sign Report
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
