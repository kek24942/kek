"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Clock,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"

const navigation = [
  {
    key: "dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    key: "patients",
    href: "/patients",
    icon: Users,
  },
  {
    key: "appointments",
    href: "/appointments",
    icon: Calendar,
  },
  {
    key: "waitingRoom",
    href: "/waiting-room",
    icon: Clock,
  },
  {
    key: "reports",
    href: "/reports",
    icon: FileText,
  },
]

export function Sidebar() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center p-6 border-b border-border">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">LubbMind</span>
            </Link>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{t(item.key)}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}