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
];

export const COLLECTIONS = {
  PROJECTS: "projects",
  EVENTS: "events",
  DELIVERABLES: "deliverables",
  EMPLOYEES: "employees",
  CLIENTS: "clients",
  UPDATES: "updates",
  PROJECT_DELIVERABLES: "projectDeliverables",
  IMAGE_SELECTIONS: "imageSelections",
  SELECTED_IMAGES: "selectedImages",
} as const;

export const ROOT_COLLECTIONS = {
  MERCHANTS: "merchants",
  MERCHANT_USERS: "merchantUsers",
};
