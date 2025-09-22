"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Network,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Eye,
  Phone,
  Smartphone,
  MessageCircle,
  MapPin,
  User,
} from "lucide-react"

interface GraphNode {
  id: string
  label: string
  type: "Person" | "Device" | "Call" | "Message" | "Location"
  properties: Record<string, any>
  x?: number
  y?: number
}

interface GraphEdge {
  id: string
  source: string
  target: string
  type: string
  properties: Record<string, any>
}

interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export default function GraphPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedCase, setSelectedCase] = useState("CASE-2025-001")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [filterType, setFilterType] = useState("all")
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  // Mock graph data
  const [graphData] = useState<GraphData>({
    nodes: [
      {
        id: "person_1",
        label: "John Doe",
        type: "Person",
        properties: { name: "John Doe", phone: "+911234567890", age: 35 },
        x: 200,
        y: 200,
      },
      {
        id: "person_2",
        label: "Jane Smith",
        type: "Person",
        properties: { name: "Jane Smith", phone: "+919876543210", age: 28 },
        x: 400,
        y: 150,
      },
      {
        id: "device_1",
        label: "iPhone 14",
        type: "Device",
        properties: { model: "iPhone 14", imei: "123456789012345", owner: "John Doe" },
        x: 200,
        y: 350,
      },
      {
        id: "device_2",
        label: "Samsung Galaxy",
        type: "Device",
        properties: { model: "Samsung Galaxy S23", imei: "987654321098765", owner: "Jane Smith" },
        x: 400,
        y: 300,
      },
      {
        id: "call_1",
        label: "Call Record",
        type: "Call",
        properties: {
          timestamp: "2025-01-15T14:30:00Z",
          duration: 180,
          from: "+911234567890",
          to: "+919876543210",
        },
        x: 300,
        y: 100,
      },
      {
        id: "message_1",
        label: "Text Message",
        type: "Message",
        properties: {
          timestamp: "2025-01-15T15:45:00Z",
          content: "Meeting at 5 PM",
          from: "+919876543210",
          to: "+911234567890",
        },
        x: 500,
        y: 200,
      },
      {
        id: "location_1",
        label: "Delhi Office",
        type: "Location",
        properties: {
          lat: 28.6139,
          lon: 77.209,
          address: "Connaught Place, New Delhi",
          timestamp: "2025-01-15T14:00:00Z",
        },
        x: 100,
        y: 300,
      },
    ],
    edges: [
      { id: "edge_1", source: "person_1", target: "device_1", type: "OWNS", properties: {} },
      { id: "edge_2", source: "person_2", target: "device_2", type: "OWNS", properties: {} },
      { id: "edge_3", source: "device_1", target: "call_1", type: "MADE_CALL", properties: {} },
      { id: "edge_4", source: "device_2", target: "call_1", type: "RECEIVED_CALL", properties: {} },
      { id: "edge_5", source: "device_2", target: "message_1", type: "SENT_MESSAGE", properties: {} },
      { id: "edge_6", source: "device_1", target: "message_1", type: "RECEIVED_MESSAGE", properties: {} },
      { id: "edge_7", source: "person_1", target: "location_1", type: "VISITED", properties: {} },
    ],
  })

  const getNodeColor = (type: GraphNode["type"]) => {
    const colors = {
      Person: "#3b82f6",
      Device: "#10b981",
      Call: "#f59e0b",
      Message: "#8b5cf6",
      Location: "#ef4444",
    }
    return colors[type]
  }

  const getNodeIcon = (type: GraphNode["type"]) => {
    switch (type) {
      case "Person":
        return <User className="h-4 w-4" />
      case "Device":
        return <Smartphone className="h-4 w-4" />
      case "Call":
        return <Phone className="h-4 w-4" />
      case "Message":
        return <MessageCircle className="h-4 w-4" />
      case "Location":
        return <MapPin className="h-4 w-4" />
    }
  }

  const drawGraph = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply zoom and pan
    ctx.save()
    ctx.scale(zoom, zoom)
    ctx.translate(pan.x, pan.y)

    // Draw edges
    graphData.edges.forEach((edge) => {
      const sourceNode = graphData.nodes.find((n) => n.id === edge.source)
      const targetNode = graphData.nodes.find((n) => n.id === edge.target)

      if (sourceNode && targetNode && sourceNode.x && sourceNode.y && targetNode.x && targetNode.y) {
        ctx.beginPath()
        ctx.moveTo(sourceNode.x, sourceNode.y)
        ctx.lineTo(targetNode.x, targetNode.y)
        ctx.strokeStyle = "#374151"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw edge label
        const midX = (sourceNode.x + targetNode.x) / 2
        const midY = (sourceNode.y + targetNode.y) / 2
        ctx.fillStyle = "#6b7280"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(edge.type, midX, midY - 5)
      }
    })

    // Draw nodes
    graphData.nodes.forEach((node) => {
      if (node.x && node.y) {
        const color = getNodeColor(node.type)

        // Draw node circle
        ctx.beginPath()
        ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI)
        ctx.fillStyle = color
        ctx.fill()
        ctx.strokeStyle = selectedNode?.id === node.id ? "#ffffff" : color
        ctx.lineWidth = selectedNode?.id === node.id ? 3 : 1
        ctx.stroke()

        // Draw node label
        ctx.fillStyle = "#ffffff"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(node.label.substring(0, 10), node.x, node.y + 35)
      }
    })

    ctx.restore()
  }

  useEffect(() => {
    drawGraph()
  }, [graphData, selectedNode, zoom, pan])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left - pan.x * zoom) / zoom
    const y = (event.clientY - rect.top - pan.y * zoom) / zoom

    // Find clicked node
    const clickedNode = graphData.nodes.find((node) => {
      if (!node.x || !node.y) return false
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2))
      return distance <= 20
    })

    setSelectedNode(clickedNode || null)
  }

  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const filteredNodes = graphData.nodes.filter((node) => {
    if (filterType !== "all" && node.type !== filterType) return false
    if (searchQuery && !node.label.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden p-6">
          <div className="h-full max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Graph Explorer</h1>
                <p className="text-muted-foreground">Visualize and explore forensic data relationships</p>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={selectedCase} onValueChange={setSelectedCase}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASE-2025-001">CASE-2025-001</SelectItem>
                    <SelectItem value="CASE-2025-002">CASE-2025-002</SelectItem>
                    <SelectItem value="CASE-2025-003">CASE-2025-003</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
              {/* Graph Visualization */}
              <div className="lg:col-span-3">
                <Card className="h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Network className="h-5 w-5" />
                        <span>Network Visualization</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setZoom(zoom * 1.2)}>
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setZoom(zoom * 0.8)}>
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={resetView}>
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={500}
                      className="w-full h-full border border-border rounded-b-lg cursor-pointer"
                      onClick={handleCanvasClick}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Side Panel */}
              <div className="space-y-6">
                {/* Search and Filter */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Search & Filter</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search nodes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div>
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Person">Persons</SelectItem>
                          <SelectItem value="Device">Devices</SelectItem>
                          <SelectItem value="Call">Calls</SelectItem>
                          <SelectItem value="Message">Messages</SelectItem>
                          <SelectItem value="Location">Locations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Node Details */}
                {selectedNode ? (
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-2">
                        {getNodeIcon(selectedNode.type)}
                        <span>Node Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="properties">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="properties">Properties</TabsTrigger>
                          <TabsTrigger value="connections">Connections</TabsTrigger>
                        </TabsList>
                        <TabsContent value="properties" className="space-y-3">
                          <div>
                            <Badge style={{ backgroundColor: getNodeColor(selectedNode.type) }}>
                              {selectedNode.type}
                            </Badge>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">ID</h4>
                            <p className="text-sm text-muted-foreground font-mono">{selectedNode.id}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">Label</h4>
                            <p className="text-sm text-muted-foreground">{selectedNode.label}</p>
                          </div>
                          {Object.entries(selectedNode.properties).map(([key, value]) => (
                            <div key={key}>
                              <h4 className="font-medium text-sm capitalize">{key.replace("_", " ")}</h4>
                              <p className="text-sm text-muted-foreground">
                                {key.includes("timestamp") ? new Date(value).toLocaleString() : String(value)}
                              </p>
                            </div>
                          ))}
                        </TabsContent>
                        <TabsContent value="connections" className="space-y-3">
                          <ScrollArea className="h-32">
                            {graphData.edges
                              .filter((edge) => edge.source === selectedNode.id || edge.target === selectedNode.id)
                              .map((edge) => {
                                const connectedNodeId = edge.source === selectedNode.id ? edge.target : edge.source
                                const connectedNode = graphData.nodes.find((n) => n.id === connectedNodeId)
                                return (
                                  <div key={edge.id} className="flex items-center justify-between py-2">
                                    <div>
                                      <p className="text-sm font-medium">{connectedNode?.label}</p>
                                      <p className="text-xs text-muted-foreground">{edge.type}</p>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      style={{ color: getNodeColor(connectedNode?.type || "Person") }}
                                    >
                                      {connectedNode?.type}
                                    </Badge>
                                  </div>
                                )
                              })}
                          </ScrollArea>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Eye className="h-5 w-5" />
                        <span>Node Inspector</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Click on a node to view its details and connections.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Legend */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Legend</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {["Person", "Device", "Call", "Message", "Location"].map((type) => (
                      <div key={type} className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: getNodeColor(type as GraphNode["type"]) }}
                        />
                        <span className="text-sm">{type}</span>
                        <span className="text-xs text-muted-foreground">
                          ({filteredNodes.filter((n) => n.type === type).length})
                        </span>
                      </div>
                    ))}
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
