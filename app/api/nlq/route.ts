import { type NextRequest, NextResponse } from "next/server"

// Mock NLQ translation templates
const nlqTemplates = [
  {
    pattern: /calls? from (\+\d+)/i,
    cypher:
      "MATCH (p:Person {phone:'$1'})-[:OWNS]->(d:Device)-[:HAS_CALL]->(c:Call) RETURN c ORDER BY c.timestamp DESC",
    confidence: 0.95,
  },
  {
    pattern: /messages? containing ['"]([^'"]+)['"]/i,
    cypher: "MATCH (m:Message) WHERE m.content CONTAINS '$1' RETURN m ORDER BY m.timestamp DESC",
    confidence: 0.88,
  },
  {
    pattern: /devices? near ([^\\s]+)/i,
    cypher:
      "MATCH (d:Device)-[:AT_LOCATION]->(l:Location) WHERE l.address CONTAINS '$1' RETURN d, l ORDER BY l.timestamp DESC",
    confidence: 0.72,
  },
  {
    pattern: /timeline for (.+)/i,
    cypher: "MATCH (p:Person {name:'$1'})-[r]->(n) RETURN p, r, n ORDER BY r.timestamp",
    confidence: 0.85,
  },
  {
    pattern: /connections? for (.+)/i,
    cypher: "MATCH (p:Person {name:'$1'})-[r]-(n) RETURN p, r, n",
    confidence: 0.8,
  },
]

export async function POST(request: NextRequest) {
  try {
    const { job_id, query } = await request.json()

    if (!job_id || !query) {
      return NextResponse.json({ error: "Missing job_id or query" }, { status: 400 })
    }

    // Find matching template
    let translatedCypher = "MATCH (n) RETURN n LIMIT 10"
    let confidence = 0.5

    for (const template of nlqTemplates) {
      const match = query.match(template.pattern)
      if (match) {
        translatedCypher = template.cypher.replace(/\$(\d+)/g, (_, index) => match[Number.parseInt(index)])
        confidence = template.confidence
        break
      }
    }

    // Generate mock results preview
    const mockResults = [
      {
        id: `result_${Math.random().toString(36).substr(2, 9)}`,
        type: "Person",
        properties: { name: "John Doe", phone: "+911234567890" },
      },
      {
        id: `result_${Math.random().toString(36).substr(2, 9)}`,
        type: "Call",
        properties: { timestamp: "2025-01-15T14:30:00Z", duration: 180 },
      },
    ]

    const response = {
      job_id,
      query,
      translated_cypher: translatedCypher,
      confidence,
      results_preview: mockResults,
      estimated_results: Math.floor(Math.random() * 100) + 1,
      query_id: `nlq_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("NLQ error:", error)
    return NextResponse.json({ error: "NLQ translation failed" }, { status: 500 })
  }
}
