import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { WrenchIcon, EngineIcon, KeyIcon, CaretRightIcon } from "@phosphor-icons/react"
import { Link } from "@tanstack/react-router"
import * as React from "react"

const tools = {
  generators: {
    label: "Generators",
    icon: EngineIcon,
    items: [
      {
        title: "Identifiers",
        path: "/tools/generators/identifiers",
        icon: KeyIcon,
      },
    ],
  },
}

export function AppSidebar() {
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({
    generators: true,
  })

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }))
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <WrenchIcon className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">DevTools</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {Object.entries(tools).map(([key, group]) => (
          <SidebarGroup key={key}>
            <Collapsible
              open={openGroups[key]}
              onOpenChange={() => toggleGroup(key)}
            >
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                  <group.icon className="mr-2" />
                  {group.label}
                  <CaretRightIcon
                    className={`ml-auto transition-transform ${
                      openGroups[key] ? "rotate-90" : ""
                    }`}
                  />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton asChild>
                          <Link to={item.path}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
