export const MONGO_COLLECTIONS = [
  "projects",
  "events",
  "deliverables",
  "employees",
  "clients",
  "updates",
  "projectDeliverables",
  "events",
  "imageSelections",
  "selectedImages",
  "quotationTemplates",
  "contractTemplates",
];

export const COLLECTIONS: Record<string, (typeof MONGO_COLLECTIONS)[number]> = {
  PROJECTS: "projects",
  EVENTS: "events",
  DELIVERABLES: "deliverables",
  EMPLOYEES: "employees",
  CLIENTS: "clients",
  UPDATES: "updates",
  PROJECT_DELIVERABLES: "projectDeliverables",
  IMAGE_SELECTIONS: "imageSelections",
  SELECTED_IMAGES: "selectedImages",
  QUOTATION_TEMPLATES: "quotationTemplates",
  CONTRACT_TEMPLATES: "contractTemplates",
} as const;

export const ROOT_COLLECTIONS = {
  MERCHANTS: "merchants",
  MERCHANT_USERS: "merchantUsers",
};
