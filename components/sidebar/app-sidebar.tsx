"use client";

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
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";

import {
  Calendar,
  Contact,
  Gamepad2Icon,
  Home,
  Inbox,
  ListIcon,
  MedalIcon,
  Search,
  Settings,
  User2,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function AppSidebar() {
  const { isLoggedIn, user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const items = [
    {
      title: "Home",
      url: "#",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
    },
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ];
  const router = isLoggedIn
    ? [
        {
          href: "/home",
          label: "Pagina Inicial",
          icon: <Home className="h-4 w-4" />,
        },

        {
          href: "/profile",
          label: "Profile",
          icon: <User2 className="h-4 w-4" />,
        },
        {
          href: "/medicalCare",
          label: "Agendar",
          icon: <MedalIcon className="h-4 w-4" />,
        },
        {
          href: "/pacient",
          label: "Lista de Pacientes",
          icon: <MedalIcon className="h-4 w-4" />,
        },
        // {
        //   href: "/users",
        //   label: "Usuarios",
        //   icon: <User2 className="h-4 w-4" />,
        // },
        {
          href: "/schedules",
          label: "Agendamentos",
          icon: <Contact className="h-4 w-4" />,
        },
        {
          href: "/games",
          label: "Games",
          icon: <Gamepad2Icon className="h-4 w-4" />,
        },
        {
          href: "/list",
          label: "Lista de Pacientes",
          icon: <ListIcon className="h-4 w-4" />,
        },
      ]
    : [
        {
          href: "/login",
          label: "Login",
          icon: <UserCog className="h-4 w-4" />,
        },
        {
          href: "/register",
          label: "Cadastro",
          icon: <Home className="h-4 w-4" />,
        },
      ];

  return (
    <Sidebar className="" variant="sidebar">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>MEDIC FORM</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {router.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.href}
                      key={item.href}
                      // className={`flex items-center p-3 rounded-lg hover:bg-gray-300 transition ${
                      //   isExpanded ? "justify-start space-x-4" : "justify-center"
                      // }`}
                      className={cn(
                        "flex items-center p-3 rounded-lg transition"
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
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

// "use client";

// import * as React from "react";
// import {
//   IconCamera,
//   IconChartBar,
//   IconDashboard,
//   IconDatabase,
//   IconFileAi,
//   IconFileDescription,
//   IconFileWord,
//   IconFolder,
//   IconHelp,
//   IconInnerShadowTop,
//   IconListDetails,
//   IconReport,
//   IconSearch,
//   IconSettings,
//   IconUsers,
// } from "@tabler/icons-react";

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar";
// import { NavMain } from "./nav-main";
// import { NavSecondary } from "./nav-secondary";
// import { NavUser } from "./nav-user";
// import { NavDocuments } from "./nav-documents";

// const data = {
//   user: {
//     name: "shadcn",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
//   navMain: [
//     {
//       title: "Dashboard",
//       url: "#",
//       icon: IconDashboard,
//     },
//     {
//       title: "Lifecycle",
//       url: "#",
//       icon: IconListDetails,
//     },
//     {
//       title: "Analytics",
//       url: "#",
//       icon: IconChartBar,
//     },
//     {
//       title: "Projects",
//       url: "#",
//       icon: IconFolder,
//     },
//     {
//       title: "Team",
//       url: "#",
//       icon: IconUsers,
//     },
//   ],
//   navClouds: [
//     {
//       title: "Capture",
//       icon: IconCamera,
//       isActive: true,
//       url: "#",
//       items: [
//         {
//           title: "Active Proposals",
//           url: "#",
//         },
//         {
//           title: "Archived",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Proposal",
//       icon: IconFileDescription,
//       url: "#",
//       items: [
//         {
//           title: "Active Proposals",
//           url: "#",
//         },
//         {
//           title: "Archived",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Prompts",
//       icon: IconFileAi,
//       url: "#",
//       items: [
//         {
//           title: "Active Proposals",
//           url: "#",
//         },
//         {
//           title: "Archived",
//           url: "#",
//         },
//       ],
//     },
//   ],
//   navSecondary: [
//     {
//       title: "Settings",
//       url: "#",
//       icon: IconSettings,
//     },
//     {
//       title: "Get Help",
//       url: "#",
//       icon: IconHelp,
//     },
//     {
//       title: "Search",
//       url: "#",
//       icon: IconSearch,
//     },
//   ],
//   documents: [
//     {
//       name: "Data Library",
//       url: "#",
//       icon: IconDatabase,
//     },
//     {
//       name: "Reports",
//       url: "#",
//       icon: IconReport,
//     },
//     {
//       name: "Word Assistant",
//       url: "#",
//       icon: IconFileWord,
//     },
//   ],
// };

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   return (
//     <Sidebar collapsible="offcanvas" {...props}>
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton
//               asChild
//               className="data-[slot=sidebar-menu-button]:!p-1.5"
//             >
//               <a href="#">
//                 <IconInnerShadowTop className="!size-5" />
//                 <span className="text-base font-semibold">Acme Inc.</span>
//               </a>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>
//       <SidebarContent>
//         {/* <NavMain items={data.navMain} />
//         <NavDocuments items={data.documents} />
//         <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
//       </SidebarContent>
//       <SidebarFooter>
//         <NavUser user={data.user} />
//       </SidebarFooter>
//     </Sidebar>
//   );
// }
