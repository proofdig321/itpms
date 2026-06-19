export type ProcurementStage = "specification" | "rfq" | "evaluation" | "adjudication" | "award" | "delivery";

export interface ProcurementItem {
  id: string;
  projectCode: string;
  description: string;
  stage: ProcurementStage;
  estimatedValue: number;
  targetDate: string;
  vendor?: string;
}
