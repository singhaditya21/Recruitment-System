import { objectCatalog, type ObjectContract } from "./objectCatalog";

export type ObjectRecord = {
  id: string;
  objectId: string;
  label: string;
  state: string;
  owner: string;
  version: number;
  updatedAt: string;
  values: Record<string, string>;
  history: Array<{
    at: string;
    actor: string;
    action: string;
    version: number;
  }>;
};

export function objectSlug(name: string) {
  return name
    .replace(/&/g, " and ")
    .replace(/\//g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function objectForSlug(
  slug: string | undefined,
): ObjectContract | undefined {
  return objectCatalog.find((item) => objectSlug(item.name) === slug);
}

export function objectListPath(object: ObjectContract) {
  return `/hr/objects/${objectSlug(object.name)}`;
}

const owners = ["Alex Rivera", "Priya Nair", "Configuration queue"];

export const seededObjectRecords: ObjectRecord[] = objectCatalog.flatMap(
  (object, objectIndex) =>
    Array.from({ length: 3 }, (_, recordIndex) => {
      const number = recordIndex + 1;
      const id = `${object.id.replace("OBJ", "REC")}-${String(number).padStart(3, "0")}`;
      const state =
        object.states[Math.min(recordIndex, object.states.length - 1)];
      const values = Object.fromEntries(
        object.dataPoints.map((field) => {
          if (field.key === "stable_id") return [field.key, id];
          if (field.key === "lifecycle_state") return [field.key, state];
          if (field.key === "business_version")
            return [field.key, String(number)];
          if (field.key === "owner_or_service")
            return [
              field.key,
              owners[(objectIndex + recordIndex) % owners.length],
            ];
          return [
            field.key,
            number === 1
              ? field.sampleValue
              : `${field.sampleValue} · fixture ${number}`,
          ];
        }),
      );
      return {
        id,
        objectId: object.id,
        label: `${object.name} fixture ${number}`,
        state,
        owner: owners[(objectIndex + recordIndex) % owners.length],
        version: number,
        updatedAt:
          number === 1
            ? "Today · 11:45 AM"
            : number === 2
              ? "Yesterday · 4:20 PM"
              : "Aug 26 · 9:10 AM",
        values,
        history: [
          {
            at: "Aug 26 · 9:00 AM",
            actor: "Fixture generator",
            action: "Created synthetic record",
            version: 1,
          },
          ...(number > 1
            ? [
                {
                  at: "Aug 27 · 4:20 PM",
                  actor: owners[(objectIndex + recordIndex) % owners.length],
                  action: "Updated permitted fields",
                  version: number,
                },
              ]
            : []),
        ],
      };
    }),
);

export const objectWorkspaceSummary = {
  objectFamilies: objectCatalog.length,
  pageTemplates: 4,
  routedPageInstances: objectCatalog.length * 4,
  seededRecords: seededObjectRecords.length,
  logicalFields: objectCatalog.reduce(
    (total, object) => total + object.dataPoints.length,
    0,
  ),
  businessFields: objectCatalog.reduce(
    (total, object) =>
      total +
      object.dataPoints.filter((field) => field.category === "Business").length,
    0,
  ),
  governanceFields: objectCatalog.reduce(
    (total, object) =>
      total +
      object.dataPoints.filter((field) => field.category === "Governance")
        .length,
    0,
  ),
};
