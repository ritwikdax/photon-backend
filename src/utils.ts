import { Document, ObjectId } from "mongodb";
/**
 * Builds MongoDB projection from fields param (e.g., fields=name,email)
 */
export function buildProjection(
  fieldsParam?: string | string[]
): Document | undefined {
  if (!fieldsParam) return undefined;

  const fields = Array.isArray(fieldsParam)
    ? fieldsParam[0].split(",")
    : fieldsParam.split(",");

  const projection: Document = {};
  for (const field of fields) {
    if (field.trim()) projection[field.trim()] = 1;
  }

  return projection;
}

export function buildQueryOptions(query: Record<string, any>) {
  const queryOptions: Document = {};

  for (const key in query) {
    // skip reserved query keys like "fields", "limit", etc.
    if (!["fields", "limit", "skip", "sort"].includes(key)) continue;

    if (key === "fields") {
      const array = query[key].split(",");
    }

    let value: any = Array.isArray(query[key]) ? query[key][0] : query[key];
    if (!value) continue;

    queryOptions[key] = value;
  }

  return queryOptions;
}

/**
 * Converts query params to MongoDB filter
 */
export function buildQuery(query: Record<string, string | string[]>): Document {
  const filter: Document = {};

  for (const key in query) {
    // skip reserved query keys like "fields", "limit", etc.
    if (["fields", "limit", "skip", "sort"].includes(key)) continue;

    let value: any = Array.isArray(query[key]) ? query[key][0] : query[key];
    if (!value) continue;

    if (!isNaN(Number(value))) value = Number(value);
    else if (value === "true" || value === "false") value = value === "true";
    else if (key === "_id") {
      try {
        value = new ObjectId(value);
      } catch {
        console.warn("⚠️ Invalid ObjectId:", value);
      }
    }

    filter[key] = value;
  }

  return filter;
}
