"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  MessageSquare,
  Send,
  CheckCircle,
  AlertTriangle,
  Clock,
  Copy,
  Play,
  Eye,
  Database,
  Lightbulb,
} from "lucide-react"

interface NLQQuery {
  id: string
  naturalQuery: string
  translatedCypher: string
  confidence: number
  status: "pending" | "approved" | "executed" | "error"
  timestamp: string
  results?: any[]
  resultCount?: number
  executionTime?: number
  error?: string
}

interface QuerySuggestion {
  category: string
  queries: string[]
}

export default function NLQPage() {
  const [currentQuery, setCurrentQuery] = useState("")
  const [selectedCase, setSelectedCase] = useState("CASE-2025-001")
  const [queries, setQueries] = useState<NLQQuery[]>([
    {
      id: "q1",
      naturalQuery: "Show calls from +911234567890 in last 30 days",
      translatedCypher:
        "MATCH (p:Person {phone:'+911234567890'})-[:OWNS]->(d:Device)-[:HAS_CALL]->(c:Call) WHERE c.timestamp >= datetime() - duration({days:30}) RETURN c ORDER BY c.timestamp DESC",
      confidence: 0.95,
      status: "executed",
      timestamp: "2025-01-15T10:30:00Z",
      results: [
        { id: "call_1", timestamp: "2025-01-15T14:30:00Z", duration: 180, to: "+919876543210" },
        { id: "call_2", timestamp: "2025-01-14T16:45:00Z", duration: 95, to: "+918765432109" },
      ],
      resultCount: 2,
      executionTime: 45,
    },
    {
      id: "q2",
      naturalQuery: "Find messages containing 'transfer'",
      translatedCypher: "MATCH (m:Message) WHERE m.content CONTAINS 'transfer' RETURN m ORDER BY m.timestamp DESC",
      confidence: 0.88,
      status: "approved",
      timestamp: "2025-01-15T11:15:00Z",
      results: [
        {
          id: "msg_1",
          timestamp: "2025-01-15T15:45:00Z",
          content: "Please transfer the amount",
          from: "+919876543210",
        },
      ],
      resultCount: 1,
      executionTime: 23,
    },
    {
      id: "q3",
      naturalQuery: "Show devices seen near Delhi on 2025-01-15",
      translatedCypher:
        "MATCH (d:Device)-[:AT_LOCATION]->(l:Location) WHERE l.address CONTAINS 'Delhi' AND date(l.timestamp) = date('2025-01-15') RETURN d, l",
      confidence: 0.72,
      status: "pending",
      timestamp: "2025-01-15T12:00:00Z",
    },
  ])

  const [selectedQuery, setSelectedQuery] = useState<NLQQuery | null>(null)

  const suggestions: QuerySuggestion[] = [
    {
      category: "Communication Analysis",
      queries: [
        "Show all calls between John Doe and Jane Smith",
        "Find messages sent in the last 24 hours",
        "Show call patterns for device with IMEI 123456789012345",
        "Find all communication from +911234567890",
      ],
    },
    {
      category: "Location Intelligence",
      queries: [
        "Show devices that visited Delhi on January 15th",
        "Find locations visited by John Doe",
        "Show movement patterns for device iPhone 14",
        "Find devices near coordinates 28.6139, 77.209",
      ],
    },
    {
      category: "Network Analysis",
      queries: [
        "Show all connections for person John Doe",
        "Find devices owned by the same person",
        "Show communication network for case CASE-2025-001",
        "Find shortest path between two phone numbers",
      ],
    },
    {
      category: "Temporal Analysis",
      queries: [
        "Show timeline for person John Doe on January 15th",
        "Find activities between 2 PM and 6 PM",
        "Show communication frequency by hour",
        "Find overlapping activities for two devices",
      ],
    },
  ]

  const handleSubmitQuery = () => {
    if (!currentQuery.trim()) return

    const newQuery: NLQQuery = {
      id: `q${Date.now()}`,
      naturalQuery: currentQuery,
      translatedCypher: "// Translating query...",
      confidence: 0,
      status: "pending",
      timestamp: new Date().toISOString(),
    }

    setQueries((prev) => [newQuery, ...prev])
    setCurrentQuery("")

    // Simulate NLQ translation
    setTimeout(() => {
      const mockCypher = generateMockCypher(currentQuery)
      const mockConfidence = Math.random() * 0.3 + 0.7 // 0.7 to 1.0

      setQueries((prev) =>
        prev.map((q) =>
          q.id === newQuery.id
            ? {
                ...q,
                translatedCypher: mockCypher,
                confidence: mockConfidence,
                status: mockConfidence > 0.8 ? "approved" : "pending",
              }
            : q,
        ),
      )
    }, 1500)
  }

  const generateMockCypher = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("call") && lowerQuery.includes("from")) {
      return "MATCH (p:Person)-[:OWNS]->(d:Device)-[:HAS_CALL]->(c:Call) WHERE p.phone CONTAINS '+91' RETURN c ORDER BY c.timestamp DESC"
    }
    if (lowerQuery.includes("message") && lowerQuery.includes("contain")) {
      return "MATCH (m:Message) WHERE m.content CONTAINS 'keyword' RETURN m ORDER BY m.timestamp DESC"
    }
    if (lowerQuery.includes("location") || lowerQuery.includes("near")) {
      return "MATCH (d:Device)-[:AT_LOCATION]->(l:Location) WHERE distance(point({latitude: l.lat, longitude: l.lon}), point({latitude: 28.6139, longitude: 77.209})) < 1000 RETURN d, l"
    }
    if (lowerQuery.includes("timeline") || lowerQuery.includes("activity")) {
      return "MATCH (p:Person)-[r]->(n) WHERE p.name = 'Person Name' RETURN p, r, n ORDER BY r.timestamp"
    }

    return "MATCH (n) WHERE n.property CONTAINS 'value' RETURN n LIMIT 10"
  }

  const executeQuery = (queryId: string) => {
    setQueries((prev) =>
      prev.map((q) =>
        q.id === queryId
          ? {
              ...q,
              status: "executed",
              results: [
                { id: "result_1", data: "Mock result data" },
                { id: "result_2", data: "Another result" },
              ],
              resultCount: 2,
              executionTime: Math.floor(Math.random() * 100) + 20,
            }
          : q,
      ),
    )
  }

  const approveQuery = (queryId: string) => {
    setQueries((prev) => prev.map((q) => (q.id === queryId ? { ...q, status: "approved" } : q)))
  }

  const getStatusIcon = (status: NLQQuery["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "executed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: NLQQuery["status"]) => {
    const variants = {
      pending: "secondary",
      approved: "default",
      executed: "default",
      error: "destructive",
    } as const

    const colors = {
      pending: "bg-yellow-500/10 text-yellow-500",
      approved: "bg-green-500/10 text-green-500",
      executed: "bg-blue-500/10 text-blue-500",
      error: "bg-red-500/10 text-red-500",
    }

    return (
      <Badge className={colors[status]} variant="secondary">
        {status === "executed" ? "Executed" : status}
      </Badge>
    )
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-500"
    if (confidence >= 0.6) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Natural Language Query Console</h1>
              <p className="text-muted-foreground">
                Query forensic data using natural language - automatically translated to Cypher
              </p>
            </div>

            {/* Query Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Query Input</span>
                </CardTitle>
                <CardDescription>
                  Ask questions about your forensic data in plain English. The system will translate to Cypher for
                  manual approval.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Input
                    placeholder="e.g., Show all calls from +911234567890 in the last 30 days"
                    value={currentQuery}
                    onChange={(e) => setCurrentQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSubmitQuery()}
                    className="flex-1"
                  />
                  <Button onClick={handleSubmitQuery} disabled={!currentQuery.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Query
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Alert */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Security Notice:</strong> All translated Cypher queries require manual approval before
                execution. Review each query carefully to ensure it matches your intent and follows security protocols.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Query History */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Query History</CardTitle>
                    <CardDescription>Recent natural language queries and their translations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-4">
                        {queries.map((query) => (
                          <div
                            key={query.id}
                            className={`p-4 border border-border rounded-lg cursor-pointer transition-colors ${
                              selectedQuery?.id === query.id ? "bg-accent/50" : "hover:bg-accent/20"
                            }`}
                            onClick={() => setSelectedQuery(query)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(query.status)}
                                {getStatusBadge(query.status)}
                                {query.confidence > 0 && (
                                  <Badge variant="outline" className={getConfidenceColor(query.confidence)}>
                                    {Math.round(query.confidence * 100)}% confidence
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(query.timestamp).toLocaleString()}
                              </span>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <p className="text-sm font-medium">Natural Query:</p>
                                <p className="text-sm text-muted-foreground">{query.naturalQuery}</p>
                              </div>

                              <div>
                                <p className="text-sm font-medium">Translated Cypher:</p>
                                <code className="text-xs bg-muted p-2 rounded block font-mono">
                                  {query.translatedCypher}
                                </code>
                              </div>

                              {query.results && (
                                <div>
                                  <p className="text-sm font-medium">
                                    Results: {query.resultCount} records ({query.executionTime}ms)
                                  </p>
                                </div>
                              )}

                              <div className="flex space-x-2 pt-2">
                                {query.status === "pending" && query.confidence > 0.6 && (
                                  <Button size="sm" onClick={() => approveQuery(query.id)}>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Approve
                                  </Button>
                                )}
                                {query.status === "approved" && (
                                  <Button size="sm" onClick={() => executeQuery(query.id)}>
                                    <Play className="h-3 w-3 mr-1" />
                                    Execute
                                  </Button>
                                )}
                                <Button variant="outline" size="sm">
                                  <Copy className="h-3 w-3 mr-1" />
                                  Copy
                                </Button>
                                {query.results && (
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-3 w-3 mr-1" />
                                    View Results
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Query Results */}
                {selectedQuery?.results && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Database className="h-5 w-5" />
                        <span>Query Results</span>
                      </CardTitle>
                      <CardDescription>
                        Results for: "{selectedQuery.naturalQuery}" ({selectedQuery.resultCount} records,{" "}
                        {selectedQuery.executionTime}ms)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedQuery.results.map((result, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-mono text-sm">{result.id}</TableCell>
                              <TableCell className="text-sm">
                                {result.timestamp ? new Date(result.timestamp).toLocaleString() : "-"}
                              </TableCell>
                              <TableCell className="text-sm">
                                {result.content || result.data || JSON.stringify(result).substring(0, 50)}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Query Suggestions */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="h-5 w-5" />
                      <span>Query Suggestions</span>
                    </CardTitle>
                    <CardDescription>Common forensic analysis queries to get you started</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="communication">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="communication">Comm</TabsTrigger>
                        <TabsTrigger value="location">Location</TabsTrigger>
                      </TabsList>
                      <TabsContent value="communication" className="space-y-3">
                        {suggestions
                          .filter((s) => s.category.includes("Communication") || s.category.includes("Network"))
                          .map((category) => (
                            <div key={category.category}>
                              <h4 className="font-medium text-sm mb-2">{category.category}</h4>
                              <div className="space-y-2">
                                {category.queries.map((query, index) => (
                                  <Button
                                    key={index}
                                    variant="ghost"
                                    size="sm"
                                    className="w-full text-left justify-start h-auto p-2 text-wrap"
                                    onClick={() => setCurrentQuery(query)}
                                  >
                                    <span className="text-xs">{query}</span>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          ))}
                      </TabsContent>
                      <TabsContent value="location" className="space-y-3">
                        {suggestions
                          .filter((s) => s.category.includes("Location") || s.category.includes("Temporal"))
                          .map((category) => (
                            <div key={category.category}>
                              <h4 className="font-medium text-sm mb-2">{category.category}</h4>
                              <div className="space-y-2">
                                {category.queries.map((query, index) => (
                                  <Button
                                    key={index}
                                    variant="ghost"
                                    size="sm"
                                    className="w-full text-left justify-start h-auto p-2 text-wrap"
                                    onClick={() => setCurrentQuery(query)}
                                  >
                                    <span className="text-xs">{query}</span>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          ))}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
