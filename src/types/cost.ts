export type CostCategory =
  | "labour"
  | "hardware"
  | "software"
  | "licenses"
  | "consulting"
  | "training"
  | "travel"
  | "contingency";

export interface CostItem {
  id: string;
  projectCode: string;
  category: CostCategory;
  description: string;
  estimatedAmount: number;
  actualAmount?: number;
}
