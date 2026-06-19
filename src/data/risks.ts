import type { Risk } from "@/types/risk";

export type { Risk };

export const risks: Risk[] = [
  {
    id: "rk1",
    projectCode: "ITPMS-001",
    description: "Vendor delivery delays due to global supply chain issues",
    probability: "medium",
    impact: "high",
    score: 6,
    mitigationPlan: "Identify alternative local suppliers",
    owner: "Thabo Mokoena",
    dueDate: "2025-03-15",
    linkedTo: "w1-2",
  },
  {
    id: "rk2",
    projectCode: "ITPMS-002",
    description: "Data loss during migration",
    probability: "low",
    impact: "high",
    score: 3,
    mitigationPlan: "Full backup before each migration phase with rollback plan",
    owner: "Naledi Dlamini",
    dueDate: "2025-05-01",
    linkedTo: "t5",
  },
  {
    id: "rk3",
    projectCode: "ITPMS-003",
    description: "Staff resistance to endpoint agent installation",
    probability: "high",
    impact: "medium",
    score: 6,
    mitigationPlan: "Change management communication and training sessions",
    owner: "Sipho Nkosi",
    dueDate: "2025-04-01",
  },
  {
    id: "rk4",
    projectCode: "ITPMS-001",
    description: "Budget overrun on fibre installation",
    probability: "medium",
    impact: "medium",
    score: 4,
    mitigationPlan: "Contingency budget allocated; phased rollout if needed",
    owner: "Kagiso Mabena",
    dueDate: "2025-05-30",
  },
];
