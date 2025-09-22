"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Phone, MessageCircle, MapPin, User, Smartphone, Filter, Calendar, Download } from "lucide-react"

interface TimelineEvent {
  id: string
  timestamp: string
  type: "call" | "message" | "location" | "device_activity"
  title: string
  description: string
  participants: string[]
  location?: string
  duration?: number
  metadata: Record<string, any>
}

export default function TimelinePage() {
  const [selectedCase, setSelectedCase] = useState("CASE-2025-001")
  const [selectedDate, setSelectedDate] = useState("2025-01-15")
  const [filterType, setFilterType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const timelineEvents: TimelineEvent[] = [
    {
      id: "evt_1",
      timestamp: "2025-01-15T08:30:00Z",
      type: "device_activity",
      title: "Device Powered On",
      description: "iPhone 14 (IMEI: 123456789012345) powered on",
      participants: ["John Doe"],
      location: "Delhi, India",
      metadata: { device: "iPhone 14", imei: "123456789012345", battery: "85%" },
    },
    {
      id: "evt_2",
      timestamp: "2025-01-15T09:15:00Z",
      type: "location",
      title: "Location Update",
      description: "Device moved to Connaught Place",
      participants: ["John Doe"],
      location: "Connaught Place, New Delhi",
      metadata: { lat: 28.6315, lon: 77.2167, accuracy: "5m" },
    },
    {
      id: "evt_3",
      timestamp: "2025-01-15T10:45:00Z",
      type: "call",
      title: "Outgoing Call",
      description: "Call to +919876543210",
      participants: ["John Doe", "Jane Smith"],
      duration: 180,
      metadata: { from: "+911234567890", to: "+919876543210", callType: "voice" },
    },
    {
      id: "evt_4",
      timestamp: "2025-01-15T11:30:00Z",
      type: "message",
      title: "Text Message Sent",
      description: "Message: 'Meeting confirmed for 2 PM'",
      participants: ["John Doe", "Jane Smith"],
      metadata: { from: "+911234567890", to: "+919876543210", messageType: "SMS" },
    },
    {
      id: "evt_5",
      timestamp: "2025-01-15T14:00:00Z",
      type: "location",
      title: "Location Update",
      description: "Device moved to India Gate",
      participants: ["John Doe"],
      location: "India Gate, New Delhi",
      metadata: { lat: 28.6129, lon: 77.2295, accuracy: "3m" },
    },
    {
      id: "evt_6",
      timestamp: "2025-01-15T14:30:00Z",
      type: "call",
      title: "Incoming Call",
      description: "Call from +918765432109",
      participants: ["John Doe", "Unknown Contact"],
      duration: 95,
      metadata: { from: "+918765432109", to: "+911234567890", callType: "voice" },
    },
    {
      id: "evt_7",
      timestamp: "2025-01-15T16:20:00Z",
      type: "message",
      title: "Text Message Received",
      description: "Message: 'Transfer completed successfully'",
      participants: ["Jane Smith", "John Doe"],
      metadata: { from: "+919876543210", to: "+911234567890", messageType: "SMS" },
    },
    {
      id: "evt_8",
      timestamp: "2025-01-15T18:45:00Z",
      type: "location",
      title: "Location Update",
      description: "Device returned to home location",
      participants: ["John Doe"],
      location: "Residential Area, Delhi",
      metadata: { lat: 28.5355, lon: 77.391, accuracy: "8m" },
    },
  ]

  const getEventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "call":
        return <Phone className="h-4 w-4" />
      case "message":
        return <MessageCircle className="h-4 w-4" />
      case "location":
        return <MapPin className="h-4 w-4" />
      case "device_activity":
        return <Smartphone className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getEventColor = (type: TimelineEvent["type"]) => {
    const colors = {
      call: "bg-blue-500",
      message: "bg-green-500",
      location: "bg-red-500",
      device_activity: "bg-purple-500",
    }
    return colors[type] || "bg-gray-500"
  }

  const getEventBadge = (type: TimelineEvent["type"]) => {
    const variants = {
      call: "Call",
      message: "Message",
      location: "Location",
      device_activity: "Device",
    }
    return variants[type] || type
  }

  const filteredEvents = timelineEvents.filter((event) => {
    if (filterType !== "all" && event.type !== filterType) return false
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Timeline Analysis</h1>
                <p className="text-muted-foreground">Chronological view of forensic data events and activities</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Timeline
                </Button>
              </div>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Timeline Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="case-select">Case ID</Label>
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
                    <Label htmlFor="date-select">Date</Label>
                    <Input
                      id="date-select"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="type-filter">Event Type</Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Events</SelectItem>
                        <SelectItem value="call">Calls</SelectItem>
                        <SelectItem value="message">Messages</SelectItem>
                        <SelectItem value="location">Locations</SelectItem>
                        <SelectItem value="device_activity">Device Activity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="search">Search Events</Label>
                    <Input
                      id="search"
                      placeholder="Search timeline..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{filteredEvents.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Calls</CardTitle>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">
                    {filteredEvents.filter((e) => e.type === "call").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Messages</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">
                    {filteredEvents.filter((e) => e.type === "message").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Locations</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">
                    {filteredEvents.filter((e) => e.type === "location").length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Event Timeline - {selectedDate}</span>
                </CardTitle>
                <CardDescription>Chronological sequence of forensic events and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>

                    <div className="space-y-6">
                      {filteredEvents.map((event, index) => (
                        <div key={event.id} className="relative flex items-start space-x-4">
                          {/* Timeline dot */}
                          <div
                            className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${getEventColor(
                              event.type,
                            )} text-white`}
                          >
                            {getEventIcon(event.type)}
                          </div>

                          {/* Event content */}
                          <div className="flex-1 min-w-0 pb-6">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <h3 className="text-sm font-medium">{event.title}</h3>
                                <Badge variant="secondary">{getEventBadge(event.type)}</Badge>
                                {event.duration && (
                                  <Badge variant="outline" className="text-xs">
                                    {formatDuration(event.duration)}
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground font-mono">
                                {formatTime(event.timestamp)}
                              </span>
                            </div>

                            <p className="text-sm text-muted-foreground mb-2">{event.description}</p>

                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span>{event.participants.join(", ")}</span>
                              </div>
                              {event.location && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                            </div>

                            {/* Metadata */}
                            <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(event.metadata).map(([key, value]) => (
                                  <div key={key}>
                                    <span className="font-medium capitalize">{key.replace("_", " ")}:</span>{" "}
                                    <span className="text-muted-foreground">{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
