"use client"

import { type LucideIcon } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavClick = (url: string) => {
    navigate(url)
  }

  return (
    <SidebarGroup className="px-2"> {/* Added padding for capsule breathing room */}
      <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 mb-2">
        Core Modules
      </SidebarGroupLabel>

      <SidebarMenu className="gap-1"> {/* Spacing between items */}
        {items.map((item) => {
          // Exact match or sub-route match logic
          const isActive = location.pathname === item.url || (item.url !== "/dashboard" && location.pathname.startsWith(item.url))

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                onClick={() => handleNavClick(item.url)}
                tooltip={item.title}
                className={`
                  relative cursor-pointer flex items-center gap-3 px-4 py-2.5
                  transition-all duration-300 rounded-[1.25rem] group
                  ${isActive 
                    ? "bg-primary/10 text-primary shadow-sm shadow-primary/5" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}
                `}
              >
                {/* Active Indicator Pillar - subtle design touch */}
                {isActive && (
                  <div className="absolute left-1.5 w-1 h-5 bg-primary rounded-full" />
                )}

                {item.icon && (
                  <item.icon
                    className={`
                      shrink-0 transition-transform duration-300
                      ${isActive ? "text-primary scale-110" : "text-muted-foreground/70 group-hover:text-foreground"}
                    `}
                    size={20}
                  />
                )}
                
                <span className={`text-sm tracking-tight transition-all ${isActive ? "font-bold" : "font-medium"}`}>
                  {item.title}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}