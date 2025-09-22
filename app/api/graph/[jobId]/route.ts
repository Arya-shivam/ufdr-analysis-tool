import { type NextRequest, NextResponse } from "next/server"

// Mock graph data generator
function generateMockGraphData(jobId: string) {
  const nodes = [
    {
      id: "person_1",
      type: "Person",
      properties: {
        name: "John Doe",
        phone: "+911234567890",
        age: 35,
      },
    },
    {
      id: "person_2",
      type: "Person",
      properties: {
        name: "Jane Smith",
        phone: "+919876543210",
        age: 28,
      },
    },
    {
      id: "device_1",
      type: "Device",
      properties: {
        model: "iPhone 14",
        imei: "123456789012345",
        owner: "John Doe",
      },
    },
    {
      id: "device_2",
      type: "Device",
      properties: {
        model: "Samsung Galaxy S23",
        imei: "987654321098765",
        owner: "Jane Smith",
      },
    },
    {
      id: "call_1",
      type: "Call",
      properties: {
        timestamp: "2025-01-15T14:30:00Z",
        duration: 180,
        from: "+911234567890",
        to: "+919876543210",
        call_type: "voice",
      },
    },
    {
      id: "message_1",
      type: "Message",
      properties: {
        timestamp: "2025-01-15T15:45:00Z",
        content: "Meeting at 5 PM",
        from: "+919876543210",
        to: "+911234567890",
        message_type: "SMS",
      },
    },
    {
      id: "location_1",
      type: "Location",
      properties: {
        lat: 28.6139,
        lon: 77.209,
        address: "Connaught Place, New Delhi",
        timestamp: "2025-01-15T14:00:00Z",
        accuracy: "5m",
      },
    },
  ]

  const relationships = [
    {
      id: "rel_1",
      source: "person_1",
      target: "device_1",
      type: "OWNS",
      properties: {
        since: "2024-01-01",
      },
    },
    {
      id: "rel_2",
      source: "person_2",
      target: "device_2",
      type: "OWNS",
      properties: {
        since: "2023-06-15",
      },
    },
    {
      id: "rel_3",
      source: "device_1",
      target: "call_1",
      type: "MADE_CALL",
      properties: {
        timestamp: "2025-01-15T14:30:00Z",
      },
    },
    {
      id: "rel_4",
      source: "device_2",
      target: "call_1",
      type: "RECEIVED_CALL",
      properties: {
        timestamp: "2025-01-15T14:30:00Z",
      },
    },
    {
      id: "rel_5",
      source: "device_2",
      target: "message_1",
      type: "SENT_MESSAGE",
      properties: {
        timestamp: "2025-01-15T15:45:00Z",
      },
    },
    {
      id: "rel_6",
      source: "device_1",
      target: "message_1",
      type: "RECEIVED_MESSAGE",
      properties: {
        timestamp: "2025-01-15T15:45:00Z",
      },
    },
    {
      id: "rel_7",
      source: "person_1",
      target: "location_1",
      type: "VISITED",
      properties: {
        timestamp: "2025-01-15T14:00:00Z",
      },
    },
  ]

  return {
    job_id: jobId,
    case_id: "CASE-2025-001",
    parser_version: "v0.1.0",
    input_hash: `sha256_${jobId.replace("job_", "")}`,
    generated_at: new Date().toISOString(),
    nodes,
    relationships,
    statistics: {
      total_nodes: nodes.length,
      total_relationships: relationships.length,
      node_types: {
        Person: nodes.filter((n) => n.type === "Person").length,
        Device: nodes.filter((n) => n.type === "Device").length,
        Call: nodes.filter((n) => n.type === "Call").length,
        Message: nodes.filter((n) => n.type === "Message").length,
        Location: nodes.filter((n) => n.type === "Location").length,
      },
    },
  }
}

export async function GET(request: NextRequest, { params }: { params: { jobId: string } }) {
  try {
    const { jobId } = params

    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 })
    }

    const graphData = generateMockGraphData(jobId)
    return NextResponse.json(graphData)
  } catch (error) {
    console.error("Graph data error:", error)
    return NextResponse.json({ error: "Failed to get graph data" }, { status: 500 })
  }
}
