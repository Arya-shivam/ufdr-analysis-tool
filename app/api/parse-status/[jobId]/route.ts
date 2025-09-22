import { type NextRequest, NextResponse } from "next/server"

// Mock parse status data
const mockParseJobs = new Map([
  [
    "job_abc123",
    {
      status: "completed",
      errors: [],
      parser_version: "v0.1.0",
      graph_json_url: "/api/graph/job_abc123.json",
      entities_found: 1247,
      relationships_found: 3891,
      start_time: "2025-01-15T10:30:00Z",
      end_time: "2025-01-15T10:32:15Z",
    },
  ],
  [
    "job_def456",
    {
      status: "parsing",
      errors: [],
      parser_version: "v0.1.0",
      progress: 65,
      entities_found: 892,
      relationships_found: 2156,
      start_time: "2025-01-15T11:15:00Z",
    },
  ],
  [
    "job_ghi789",
    {
      status: "error",
      errors: ["Invalid JSON format detected in source file"],
      parser_version: "v0.1.0",
      start_time: "2025-01-15T11:45:00Z",
      end_time: "2025-01-15T11:45:30Z",
    },
  ],
])

export async function GET(request: NextRequest, { params }: { params: { jobId: string } }) {
  try {
    const { jobId } = params

    // Check if job exists in mock data
    const jobData = mockParseJobs.get(jobId)

    if (!jobData) {
      // Generate dynamic mock data for new job IDs
      const mockData = {
        status: Math.random() > 0.7 ? "completed" : Math.random() > 0.5 ? "parsing" : "error",
        errors: Math.random() > 0.8 ? ["Mock parsing error"] : [],
        parser_version: "v0.1.0",
        entities_found: Math.floor(Math.random() * 2000) + 100,
        relationships_found: Math.floor(Math.random() * 5000) + 500,
        start_time: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      }

      if (mockData.status === "completed") {
        mockData.graph_json_url = `/api/graph/${jobId}.json`
        mockData.end_time = new Date().toISOString()
      } else if (mockData.status === "parsing") {
        mockData.progress = Math.floor(Math.random() * 80) + 10
      }

      return NextResponse.json(mockData)
    }

    return NextResponse.json(jobData)
  } catch (error) {
    console.error("Parse status error:", error)
    return NextResponse.json({ error: "Failed to get parse status" }, { status: 500 })
  }
}
