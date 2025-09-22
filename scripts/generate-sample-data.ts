// Sample data generation script for UFDR Analysis Tool
// This script generates synthetic forensic data for demonstration purposes

interface SampleData {
  caseId: string
  persons: Person[]
  devices: Device[]
  calls: Call[]
  messages: Message[]
  locations: Location[]
}

interface Person {
  id: string
  name: string
  phone: string
  age: number
  address: string
}

interface Device {
  id: string
  imei: string
  model: string
  os: string
  owner: string
}

interface Call {
  id: string
  from: string
  to: string
  timestamp: string
  duration: number
  callType: "voice" | "video"
  towerId?: string
}

interface Message {
  id: string
  from: string
  to: string
  timestamp: string
  content: string
  messageType: "SMS" | "MMS" | "WhatsApp"
}

interface Location {
  id: string
  deviceId: string
  timestamp: string
  latitude: number
  longitude: number
  accuracy: number
  address: string
}

function generateSampleData(): SampleData {
  const persons: Person[] = [
    {
      id: "person_001",
      name: "John Doe",
      phone: "+911234567890",
      age: 35,
      address: "New Delhi, India",
    },
    {
      id: "person_002",
      name: "Jane Smith",
      phone: "+919876543210",
      age: 28,
      address: "Mumbai, India",
    },
    {
      id: "person_003",
      name: "Mike Johnson",
      phone: "+918765432109",
      age: 42,
      address: "Bangalore, India",
    },
  ]

  const devices: Device[] = [
    {
      id: "device_001",
      imei: "123456789012345",
      model: "iPhone 14",
      os: "iOS 17.2",
      owner: "John Doe",
    },
    {
      id: "device_002",
      imei: "987654321098765",
      model: "Samsung Galaxy S23",
      os: "Android 14",
      owner: "Jane Smith",
    },
    {
      id: "device_003",
      imei: "456789123456789",
      model: "Google Pixel 8",
      os: "Android 14",
      owner: "Mike Johnson",
    },
  ]

  const calls: Call[] = [
    {
      id: "call_001",
      from: "+911234567890",
      to: "+919876543210",
      timestamp: "2025-01-15T14:30:00Z",
      duration: 180,
      callType: "voice",
      towerId: "TOWER_DEL_001",
    },
    {
      id: "call_002",
      from: "+919876543210",
      to: "+918765432109",
      timestamp: "2025-01-15T16:45:00Z",
      duration: 95,
      callType: "voice",
      towerId: "TOWER_MUM_002",
    },
    {
      id: "call_003",
      from: "+918765432109",
      to: "+911234567890",
      timestamp: "2025-01-15T18:20:00Z",
      duration: 240,
      callType: "video",
      towerId: "TOWER_BLR_003",
    },
  ]

  const messages: Message[] = [
    {
      id: "message_001",
      from: "+919876543210",
      to: "+911234567890",
      timestamp: "2025-01-15T15:45:00Z",
      content: "Meeting confirmed for 2 PM",
      messageType: "SMS",
    },
    {
      id: "message_002",
      from: "+911234567890",
      to: "+918765432109",
      timestamp: "2025-01-15T17:30:00Z",
      content: "Please transfer the amount as discussed",
      messageType: "WhatsApp",
    },
    {
      id: "message_003",
      from: "+918765432109",
      to: "+919876543210",
      timestamp: "2025-01-15T19:15:00Z",
      content: "Transaction completed successfully",
      messageType: "SMS",
    },
  ]

  const locations: Location[] = [
    {
      id: "location_001",
      deviceId: "device_001",
      timestamp: "2025-01-15T14:00:00Z",
      latitude: 28.6139,
      longitude: 77.209,
      accuracy: 5,
      address: "Connaught Place, New Delhi",
    },
    {
      id: "location_002",
      deviceId: "device_002",
      timestamp: "2025-01-15T16:30:00Z",
      latitude: 19.076,
      longitude: 72.8777,
      accuracy: 8,
      address: "Marine Drive, Mumbai",
    },
    {
      id: "location_003",
      deviceId: "device_003",
      timestamp: "2025-01-15T18:00:00Z",
      latitude: 12.9716,
      longitude: 77.5946,
      accuracy: 3,
      address: "MG Road, Bangalore",
    },
  ]

  return {
    caseId: "CASE-2025-001",
    persons,
    devices,
    calls,
    messages,
    locations,
  }
}

// Generate and log sample data
const sampleData = generateSampleData()
console.log("Generated sample UFDR data:")
console.log(JSON.stringify(sampleData, null, 2))

export { generateSampleData, type SampleData }
