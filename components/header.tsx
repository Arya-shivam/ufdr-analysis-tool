"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, User } from "lucide-react"

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">UFDR Analysis Tool</h1>
          <p className="text-sm text-muted-foreground">
            Universal Forensic Data Reader - Investigation Platform v0.1.0
          </p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          Demo Environment
        </Badge>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">Forensic Analyst</p>
            <p className="text-muted-foreground">analyst@forensics.gov</p>
          </div>
        </div>
      </div>
    </header>
  )
}
