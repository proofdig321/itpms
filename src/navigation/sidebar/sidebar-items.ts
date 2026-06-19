import {
  AlertTriangle,
  Banknote,
  Bell,
  Calendar,
  CheckSquare,
  ClipboardList,
  FileText,
  FolderKanban,
  Gauge,
  GitCompare,
  History,
  LayoutDashboard,
  type LucideIcon,
  PieChart,
  Route,
  ShoppingCart,
  Shuffle,
  Target,
  TrendingUp,
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
  {
    id: 4,
    label: "Analytics",
    items: [
      {
        title: "Dashboards",
        url: "/dashboard/planning/dashboards",
        icon: PieChart,
      },
      {
        title: "Baselines",
        url: "/dashboard/planning/baselines",
        icon: Target,
      },
      {
        title: "EVM",
        url: "/dashboard/planning/evm",
        icon: TrendingUp,
      },
      {
        title: "Critical Path",
        url: "/dashboard/planning/critical-path",
        icon: Route,
      },
      {
        title: "Change Impact",
        url: "/dashboard/planning/change-impact",
        icon: GitCompare,
      },
      {
        title: "Scenarios",
        url: "/dashboard/planning/scenarios",
        icon: Shuffle,
      },
      {
        title: "Calendars",
        url: "/dashboard/planning/calendars",
        icon: Calendar,
      },
    ],
  },
  {
    id: 5,
    label: "System",
    items: [
      {
        title: "Reports",
        url: "/dashboard/reports",
        icon: FileText,
      },
      {
        title: "Notifications",
        url: "/dashboard/notifications",
        icon: Bell,
      },
      {
        title: "Audit History",
        url: "/dashboard/audit",
        icon: History,
      },
    ],
  },
];
