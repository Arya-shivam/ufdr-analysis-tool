import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { job_id, sections, signer, title, case_id } = await request.json()

    if (!job_id || !sections || !signer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate report ID
    const reportId = `rpt_${Math.random().toString(36).substr(2, 9)}`

    // Generate mock signature
    const reportData = {
      case_id: case_id || "CASE-2025-001",
      job_id,
      title: title || "Forensic Analysis Report",
      sections,
      signer: signer.name || signer,
      timestamp: new Date().toISOString(),
      tool_version: "v0.1.0",
      parser_version: "v0.1.0",
    }

    const signature = crypto.createHash("sha256").update(JSON.stringify(reportData)).digest("base64").substring(0, 32)

    const response = {
      report_id: reportId,
      pdf_url: `/reports/${reportId}.pdf`,
      json_url: `/reports/${reportId}.json`,
      report_json: {
        ...reportData,
        report_id: reportId,
        signature: `sig_${signature}`,
        input_hash: `sha256_${crypto.randomBytes(8).toString("hex")}`,
        status: "generated",
      },
      generation_time: Math.floor(Math.random() * 5000) + 1000, // 1-6 seconds
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Report generation error:", error)
    return NextResponse.json({ error: "Report generation failed" }, { status: 500 })
  }
}
