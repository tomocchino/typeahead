import {
  MapPinned,
  MapPin,
  UserRound,
  WholeWord,
  Smile,
  Clapperboard,
  Rows3,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "States",
    url: "/states",
    icon: MapPinned,
  },
  {
    title: "Cities",
    url: "/cities",
    icon: MapPin,
  },
  {
    title: "Actors",
    url: "/actors",
    icon: UserRound,
  },
  {
    title: "Strings",
    url: "/strings",
    icon: WholeWord,
  },
  {
    title: "Emoji",
    url: "/emoji",
    icon: Smile,
  },
  {
    title: "Movies",
    url: "/movies",
    icon: Clapperboard,
  },
  {
    title: "Movie List",
    url: "/movies/list",
    icon: Rows3,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Examples</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
