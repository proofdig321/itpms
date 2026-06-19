import {
  AlertTriangle,
  Banknote,
  CheckSquare,
  ClipboardList,
  FolderKanban,
  Gauge,
  LayoutDashboard,
  type LucideIcon,
  ShoppingCart,
  Users,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard/monitoring",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: 2,
    label: "Project Management",
    items: [
      {
        title: "Projects",
        url: "/dashboard/projects",
        icon: FolderKanban,
      },
      {
        title: "Planning",
        url: "/dashboard/planning",
        icon: ClipboardList,
      },
      {
        title: "Tasks",
        url: "/dashboard/planning/tasks",
        icon: CheckSquare,
      },
      {
        title: "Monitoring",
        url: "/dashboard/monitoring",
        icon: Gauge,
      },
    ],
  },
  {
    id: 3,
    label: "Planning Support",
    items: [
      {
        title: "Resources",
        url: "/dashboard/planning/resources",
        icon: Users,
      },
      {
        title: "Cost Plan",
        url: "/dashboard/planning/costs",
        icon: Banknote,
      },
      {
        title: "Procurement",
        url: "/dashboard/planning/procurement",
        icon: ShoppingCart,
      },
      {
        title: "Risks",
        url: "/dashboard/planning/risks",
        icon: AlertTriangle,
      },
    ],
  },
];
