export interface Resource {
  id: string;
  projectCode: string;
  name: string;
  role: string;
  department: string;
  allocation: number; // percentage 0-100
  availableFrom: string;
  availableTo: string;
}
