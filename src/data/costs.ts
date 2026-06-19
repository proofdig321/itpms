import type { CostItem } from "@/types/cost";

export type { CostItem };

export const costItems: CostItem[] = [
  {
    id: "c1",
    projectCode: "ITPMS-001",
    category: "hardware",
    description: "Core network switches (x12)",
    estimatedAmount: 1200000,
    actualAmount: 980000,
  },
  {
    id: "c2",
    projectCode: "ITPMS-001",
    category: "hardware",
    description: "Fibre optic cabling",
    estimatedAmount: 450000,
  },
  {
    id: "c3",
    projectCode: "ITPMS-001",
    category: "consulting",
    description: "Network design consultants",
    estimatedAmount: 350000,
    actualAmount: 350000,
  },
  {
    id: "c4",
    projectCode: "ITPMS-001",
    category: "labour",
    description: "Installation team (3 months)",
    estimatedAmount: 600000,
  },
  {
    id: "c5",
    projectCode: "ITPMS-001",
    category: "contingency",
    description: "Project contingency (10%)",
    estimatedAmount: 260000,
  },
  {
    id: "c6",
    projectCode: "ITPMS-002",
    category: "software",
    description: "ERP license fees",
    estimatedAmount: 2500000,
  },
  {
    id: "c7",
    projectCode: "ITPMS-002",
    category: "consulting",
    description: "Migration consultants",
    estimatedAmount: 800000,
  },
  {
    id: "c8",
    projectCode: "ITPMS-002",
    category: "training",
    description: "Staff training programme",
    estimatedAmount: 150000,
  },
];
