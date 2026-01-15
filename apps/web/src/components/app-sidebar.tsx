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
import { WrenchIcon, EngineIcon, KeyIcon, CaretRightIcon, BinaryIcon, BlueprintIcon, SwapIcon, ClockIcon } from "@phosphor-icons/react"
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
  encoders: {
    label: "Encoders / Decoders",
    icon: BinaryIcon,
    items: [
      {
        title: "Base64",
        path: "/tools/encoders/base64",
        icon: BlueprintIcon,
      },
    ],
  },
  converters: {
    label: "Converters",
    icon: SwapIcon,
    items: [
      {
        title: "Date-time",
        path: "/tools/converters/datetime",
        icon: ClockIcon,
      },
    ],
  },
}

export function AppSidebar() {
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({
    generators: true,
    encoders: true,
    converters: true,
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
      <SidebarFooter>
        <div className="px-4 py-2 text-xs text-muted-foreground">
          <div className="flex flex-col gap-1">
            <div>DevTools v0.1.0</div>
            <div>© 2026 Konrad Żukowski</div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
