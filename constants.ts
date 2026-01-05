
import { ReferenceImage, Section } from './types';

export const SCHNEIDER_GREEN = '#3DCD58';
export const SCHNEIDER_DEEP = '#108533';

export const SECTIONS: Section[] = [
  "Door", "Box", "Saddle", "Routing", "Terminal", "Front View", "Side View"
];

export const COMMON_TAGS = [
  "mesh", "bundling", "bend radius", "torque", "labeling", "routing", 
  "clearance", "separation", "grounding", "neatness", "UL-certified"
];

const generateSeedData = (): ReferenceImage[] => {
  const customers = ["EcoPower Solutions", "GridSystems Global", "MegaCorp Industrial", "VoltGen Energy", "Vertex Manufacturing"];
  const orders = ["ORD-2024-001", "ORD-2024-002", "ORD-2024-055", "ORD-2023-999", "ORD-2025-010"];
  
  const seed: ReferenceImage[] = [];
  
  for (let i = 1; i <= 25; i++) {
    const customer = customers[i % customers.length];
    const order = orders[i % orders.length];
    const section = SECTIONS[i % SECTIONS.length];
    const tags = [
      COMMON_TAGS[i % COMMON_TAGS.length],
      COMMON_TAGS[(i + 2) % COMMON_TAGS.length]
    ];

    seed.push({
      id: `ref-${i}`,
      title: `${section} Wiring - ${customer}`,
      customer,
      orderNumber: order,
      section,
      tags,
      notes: `Standard ${section} wiring configuration for ${customer}. Inspection passed for ${tags.join(' and ')} requirements.`,
      image: {
        type: "url",
        value: `https://picsum.photos/seed/elec-${i}/800/600?random=${i}`
      },
      createdAt: new Date(Date.now() - (i * 86400000)).toISOString(),
      updatedAt: new Date(Date.now() - (i * 43200000)).toISOString(),
    });
  }
  
  return seed;
};

export const INITIAL_SEED = generateSeedData();
