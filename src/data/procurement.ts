import type { ProcurementItem } from "@/types/procurement";

export type { ProcurementItem };

export const procurementItems: ProcurementItem[] = [
  {
    id: "p1",
    projectCode: "ITPMS-001",
    description: "Core network switches",
    stage: "award",
    estimatedValue: 1200000,
    targetDate: "2025-03-15",
    vendor: "NetCom Solutions",
  },
  {
    id: "p2",
    projectCode: "ITPMS-001",
    description: "Fibre optic installation services",
    stage: "evaluation",
    estimatedValue: 450000,
    targetDate: "2025-04-15",
  },
  {
    id: "p3",
    projectCode: "ITPMS-002",
    description: "ERP software licenses",
    stage: "adjudication",
    estimatedValue: 2500000,
    targetDate: "2025-05-01",
  },
  {
    id: "p4",
    projectCode: "ITPMS-003",
    description: "Endpoint protection software",
    stage: "rfq",
    estimatedValue: 800000,
    targetDate: "2025-04-30",
  },
];
