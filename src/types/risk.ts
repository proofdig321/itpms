export type RiskProbability = "low" | "medium" | "high";
export type RiskImpact = "low" | "medium" | "high";

export interface Risk {
  id: string;
  projectCode: string;
  description: string;
  probability: RiskProbability;
  impact: RiskImpact;
  score: number; // probability × impact (backend-computed)
  mitigationPlan: string;
  owner: string;
  dueDate: string;
  linkedTo?: string; // task/milestone/deliverable ID
}
