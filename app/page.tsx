import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Database, FileText, Shield, Clock, AlertTriangle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">+1 from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Files Processed</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">127</div>
                  <p className="text-xs text-muted-foreground">+12 today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Status</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold text-green-500">Online</div>
                  </div>
                  <p className="text-xs text-muted-foreground">All services operational</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Security Level</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">Secure</div>
                  <p className="text-xs text-muted-foreground">All protocols active</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                  <CardDescription>Latest system events and case updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">CASE-2025-001 uploaded</p>
                        <p className="text-xs text-muted-foreground">2 minutes ago</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Upload</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Graph analysis completed</p>
                        <p className="text-xs text-muted-foreground">15 minutes ago</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Analysis</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Report generated</p>
                        <p className="text-xs text-muted-foreground">1 hour ago</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Report</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>System Alerts</span>
                  </CardTitle>
                  <CardDescription>Important notifications and warnings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Demo Environment Active</p>
                      <p className="text-xs text-muted-foreground">
                        Using synthetic data only. No real UFDR files processed.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-chart-4 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Manual Cypher Approval Required</p>
                      <p className="text-xs text-muted-foreground">
                        All NLQ translations require analyst verification.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common forensic analysis workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                    <h3 className="font-medium mb-2">Upload New Case</h3>
                    <p className="text-sm text-muted-foreground">Start analysis of new UFDR files</p>
                  </div>

                  <div className="p-4 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                    <h3 className="font-medium mb-2">Query Data</h3>
                    <p className="text-sm text-muted-foreground">Use natural language to explore data</p>
                  </div>

                  <div className="p-4 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                    <h3 className="font-medium mb-2">Generate Report</h3>
                    <p className="text-sm text-muted-foreground">Create signed forensic reports</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
