export const SidebarData = {
  admin: [
    {
      title: "Dashboard",
      icon: "📊",
      submenu: [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Comparison", path: "/comparison" },
      ],
    },
    {
      title: "Settings",
      icon: "⚙️",
      submenu: [
        { title: "Users", path: "/settings/users" },
        { title: "Zones", path: "/settings/zones" },
        { title: "Preferences", path: "/settings/preferences" },
        { title: "System Settings", path: "/settings/system" },
      ],
    },
  ],

  user: [
    {
      title: "Dashboard",
      icon: "📊",
      submenu: [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Comparison", path: "/comparison" },
      ],
    },
  ],
};
