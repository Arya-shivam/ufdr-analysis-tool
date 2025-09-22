import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const caseId = formData.get("caseId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Generate mock hash for the file
    const fileBuffer = await file.arrayBuffer()
    const hash = crypto.createHash("sha256").update(Buffer.from(fileBuffer)).digest("hex")
    const inputHash = `sha256_${hash.substring(0, 16)}`

    // Generate job ID
    const jobId = `job_${crypto.randomBytes(4).toString("hex")}`

    // Generate case ID if not provided
    const finalCaseId = caseId || `CASE-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`

    // Mock response matching the API contract
    const response = {
      job_id: jobId,
      input_hash: inputHash,
      case_id: finalCaseId,
      file_name: file.name,
      file_size: file.size,
      upload_timestamp: new Date().toISOString(),
      status: "uploaded",
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
