import type { Resource } from "@/types/resource";

export type { Resource };

export const resources: Resource[] = [
  {
    id: "r1",
    projectCode: "ITPMS-001",
    name: "Sipho Nkosi",
    role: "Network Engineer",
    department: "ICT Infrastructure",
    allocation: 80,
    availableFrom: "2025-01-15",
    availableTo: "2025-06-30",
  },
  {
    id: "r2",
    projectCode: "ITPMS-001",
    name: "Kagiso Mabena",
    role: "Project Coordinator",
    department: "ICT PMO",
    allocation: 50,
    availableFrom: "2025-01-15",
    availableTo: "2025-06-30",
  },
  {
    id: "r3",
    projectCode: "ITPMS-002",
    name: "Naledi Dlamini",
    role: "Systems Analyst",
    department: "ICT Applications",
    allocation: 100,
    availableFrom: "2025-02-01",
    availableTo: "2025-08-31",
  },
  {
    id: "r4",
    projectCode: "ITPMS-001",
    name: "Thabo Mokoena",
    role: "Procurement Specialist",
    department: "SCM",
    allocation: 30,
    availableFrom: "2025-02-16",
    availableTo: "2025-04-30",
  },
];
