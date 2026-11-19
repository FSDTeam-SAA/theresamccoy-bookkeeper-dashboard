export type DashboardNavItem = {
  label: string;
  icon: string;
  /** Routes without an `href` are not built yet and render as disabled. */
  href?: string;
  iconSize?: number;
};

const icon = (name: string) => `/images/dashboard/nav/${name}.svg`;

export const dashboardNavItems: DashboardNavItem[] = [
  {
    label: "Dashboard Overview",
    href: "/dashboard",
    icon: icon("dashboard"),
    iconSize: 28,
  },
  { label: "Profile & Skills", href: "/dashboard/profile", icon: icon("profile") },
  {
    label: "Application",
    href: "/dashboard/application",
    icon: icon("application"),
  },
  { label: "Courses", icon: icon("courses") },
  { label: "Certificates", icon: icon("certificates") },
  { label: "Engagement", icon: icon("engagement") },
  { label: "Requests", icon: icon("requests") },
  { label: "Messages", icon: icon("messages") },
  { label: "Reviews", icon: icon("reviews") },
  { label: "Settings", icon: icon("settings") },
];

export function isNavItemActive(pathname: string, href?: string) {
  if (!href) return false;
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}
