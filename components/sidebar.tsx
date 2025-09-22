"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Upload,
  Activity,
  Network,
  MessageSquare,
  Clock,
  FileText,
  Shield,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const navigation = [
  {
    name: "Overview",
    href: "/",
    icon: Activity,
    description: "System status and recent activity",
  },
  {
    name: "Upload",
    href: "/upload",
    icon: Upload,
    description: "Upload UFDR files for analysis",
  },
  {
    name: "Parse Status",
    href: "/parse-status",
    icon: Database,
    description: "Monitor parsing progress",
  },
  {
    name: "Graph Explorer",
    href: "/graph",
    icon: Network,
    description: "Visualize data relationships",
  },
  {
    name: "NLQ Console",
    href: "/nlq",
    icon: MessageSquare,
    description: "Natural language queries",
  },
  {
    name: "Timeline",
    href: "/timeline",
    icon: Clock,
    description: "Chronological data view",
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
    description: "Generate signed reports",
  },
  {
    name: "Audit",
    href: "/audit",
    icon: Shield,
    description: "System audit logs",
  },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-sidebar-primary" />
            <span className="font-semibold text-sidebar-foreground">UFDR Analysis</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left",
                    collapsed ? "px-2" : "px-3",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
                  {!collapsed && (
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs opacity-70">{item.description}</span>
                    </div>
                  )}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Link href="/settings">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
              collapsed ? "px-2" : "px-3",
            )}
          >
            <Settings className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
            {!collapsed && "Settings"}
          </Button>
        </Link>
      </div>
    </div>
  )
}
