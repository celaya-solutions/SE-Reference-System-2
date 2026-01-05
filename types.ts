
export type Section = "Door" | "Box" | "Saddle" | "Routing" | "Terminal" | "Front View" | "Side View";

export interface ReferenceImage {
  id: string;
  title: string;
  customer: string;
  orderNumber: string;
  section: Section;
  tags: string[];
  notes: string;
  image: {
    type: "url" | "base64";
    value: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface KPIStats {
  totalReferences: number;
  uniqueCustomers: number;
  uniqueOrders: number;
  taggedStandards: number;
}
