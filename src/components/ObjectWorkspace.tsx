import { useEffect, useMemo, useState, type FormEvent } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Braces,
  CheckCircle2,
  Database,
  Edit3,
  Eye,
  FilePlus2,
  History,
  KeyRound,
  LockKeyhole,
  Search,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import {
  canCreateObject,
  canReadObject,
  canReadObjectRecord,
  fieldAccessForRole,
  roleDataScopes,
} from "../data/access";
import {
  objectCatalog,
  objectCatalogSummary,
  objectDomains,
  type ObjectContract,
} from "../data/objectCatalog";
import {
  objectForSlug,
  objectListPath,
  objectWorkspaceSummary,
} from "../data/objectWorkspace";
import { usePrototype } from "../prototype/PrototypeContext";
import { ExplainPanel, Pill } from "./Common";

function recordsForRole(
  role: string,
  personaId: string,
  object: ObjectContract,
  records: ReturnType<typeof usePrototype>["objectRecords"],
) {
  return records.filter(
    (record) =>
      record.objectId === object.id &&
      canReadObjectRecord(role, personaId, object, record),
  );
}

function ObjectMatrix() {
  const { persona } = usePrototype();
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("all");
  const visibleObjects = useMemo(
    () =>
      objectCatalog.filter((object) => {
        const matchesQuery =
          !query.trim() ||
          `${object.id} ${object.name} ${object.domain} ${object.personas.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase());
        return (
          matchesQuery &&
          (domain === "all" || object.domain === domain) &&
          canReadObject(persona.role, object)
        );
      }),
    [domain, persona.role, query],
  );

  return (
    <div className="object-workspace-index">
      <section
        className="object-contract-summary"
        aria-label="Routed object workspace coverage"
      >
        <article>
          <Database size={20} />
          <span>
            <strong>{objectWorkspaceSummary.objectFamilies}</strong>Object
            families
          </span>
          <Pill tone="success">Governed</Pill>
        </article>
        <article>
          <Workflow size={20} />
          <span>
            <strong>{objectWorkspaceSummary.routedPageInstances}</strong>Routed
            page instances
          </span>
          <Pill tone="success">4 per family</Pill>
        </article>
        <article>
          <Braces size={20} />
          <span>
            <strong>{objectWorkspaceSummary.logicalFields}</strong>Logical data
            points
          </span>
          <Pill tone="info">
            {objectWorkspaceSummary.businessFields} business
          </Pill>
        </article>
        <article>
          <FilePlus2 size={20} />
          <span>
            <strong>{objectWorkspaceSummary.seededRecords}</strong>Seeded
            records
          </span>
          <Pill tone="success">12 per family</Pill>
        </article>
      </section>

      <section
        className="object-contract-filters"
        aria-label="Object workspace filters"
      >
        <label className="object-search">
          <Search size={16} />
          <span className="sr-only">Search routed objects</span>
          <input
            aria-label="Search routed objects"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search object, domain, or persona"
          />
        </label>
        <label>
          <span>Domain</span>
          <select
            aria-label="Routed object domain filter"
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
          >
            <option value="all">All permitted domains</option>
            {objectDomains.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <span role="status">{visibleObjects.length} role-visible families</span>
      </section>

      <section className="panel matrix-panel">
        <div className="panel-heading">
          <div>
            <h2>Object × page × data-point matrix</h2>
            <span>
              Every family resolves through the same governed page-state
              contract
            </span>
          </div>
          <Pill tone="success">List · New · Detail · Edit</Pill>
        </div>
        <div
          className="object-page-matrix"
          role="table"
          aria-label="Object page and field coverage matrix"
        >
          <div className="object-page-row object-page-head" role="row">
            <span role="columnheader">Object</span>
            <span role="columnheader">Domain</span>
            <span role="columnheader">Personas</span>
            <span role="columnheader">Data points</span>
            <span role="columnheader">Pages</span>
            <span role="columnheader">Workspace</span>
          </div>
          {visibleObjects.map((object) => (
            <div className="object-page-row" role="row" key={object.id}>
              <span role="cell" data-label="Object">
                <strong>{object.name}</strong>
                <small>
                  {object.id} · {object.lifecycleType}
                </small>
              </span>
              <span role="cell" data-label="Domain">
                {object.domain}
              </span>
              <span role="cell" data-label="Personas">
                {object.personas
                  .filter((role) => role !== "Candidate")
                  .join(", ") || "Restricted"}
              </span>
              <span role="cell" data-label="Data points">
                <strong>{object.dataPoints.length}</strong>
                <small>
                  {
                    object.dataPoints.filter(
                      (field) => field.category === "Business",
                    ).length
                  }{" "}
                  business ·{" "}
                  {
                    object.dataPoints.filter(
                      (field) => field.category === "Governance",
                    ).length
                  }{" "}
                  governance
                </small>
              </span>
              <span role="cell" data-label="Pages">
                <span className="page-state-badges">
                  <i>L</i>
                  <i>N</i>
                  <i>D</i>
                  <i>E</i>
                </span>
              </span>
              <span role="cell" data-label="Workspace">
                <NavLink className="table-link" to={objectListPath(object)}>
                  Open <ArrowRight size={14} />
                </NavLink>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel matrix-panel">
        <div className="panel-heading">
          <div>
            <h2>Role × data-scope matrix</h2>
            <span>
              Navigation permission never implies unrestricted row or field
              access
            </span>
          </div>
          <Pill tone="info">12 internal personas</Pill>
        </div>
        <div
          className="role-scope-matrix"
          role="table"
          aria-label="Persona role and data-scope matrix"
        >
          <div className="role-scope-row role-scope-head" role="row">
            <span role="columnheader">Role</span>
            <span role="columnheader">Population</span>
            <span role="columnheader">Identity</span>
            <span role="columnheader">Decision evidence</span>
            <span role="columnheader">Compensation</span>
            <span role="columnheader">Privacy</span>
            <span role="columnheader">Export</span>
          </div>
          {Object.entries(roleDataScopes).map(([role, scope]) => (
            <div className="role-scope-row" role="row" key={role}>
              <strong role="cell" data-label="Role">
                {role}
              </strong>
              <span role="cell" data-label="Population">
                {scope.population}
              </span>
              <span role="cell" data-label="Identity">
                {scope.identity}
              </span>
              <span role="cell" data-label="Decision evidence">
                {scope.decisionEvidence}
              </span>
              <span role="cell" data-label="Compensation">
                {scope.compensation}
              </span>
              <span role="cell" data-label="Privacy">
                {scope.privacy}
              </span>
              <span role="cell" data-label="Export">
                {scope.export}
              </span>
            </div>
          ))}
        </div>
      </section>

      <ExplainPanel
        title="Current matrix position"
        source="v2.1 metadata-driven core and lifecycle registry"
      >
        The workspace now covers 92 inherited recruitment families plus 46
        lifecycle-extension families: 138 routed families, 2,208 field
        contracts, 1,656 seeded rows and 552 list/new/detail/edit page instances.
        These are synthetic wireframe contracts; approved Salesforce API names
        and physical field/security metadata remain a separate implementation
        gate.
      </ExplainPanel>
    </div>
  );
}

function ObjectList({ object }: { object: ObjectContract }) {
  const { persona, objectRecords } = usePrototype();
  const rows = recordsForRole(
    persona.role,
    persona.id,
    object,
    objectRecords,
  );
  const canCreate = canCreateObject(persona.role, object);
  return (
    <div className="object-record-workspace">
      <div className="object-workspace-toolbar">
        <NavLink className="text-button" to="/hr/objects">
          <ArrowLeft size={15} /> All objects
        </NavLink>
        <div className="page-actions">
          {canCreate ? (
            <NavLink
              className="primary-button"
              to={`${objectListPath(object)}/new`}
            >
              <FilePlus2 size={16} /> New {object.name}
            </NavLink>
          ) : (
            <button className="secondary-button" disabled>
              <LockKeyhole size={16} /> Create not permitted
            </button>
          )}
        </div>
      </div>
      <section className="panel record-list-panel">
        <div className="panel-heading">
          <div>
            <h2>{object.name} records</h2>
            <span>
              {rows.length} of{" "}
              {
                objectRecords.filter((record) => record.objectId === object.id)
                  .length
              }{" "}
              seeded rows visible to {persona.role}
            </span>
          </div>
          <Pill tone="info">{object.lifecycleType}</Pill>
        </div>
        {rows.length ? (
          <div
            className="object-record-table"
            role="table"
            aria-label={`${object.name} seeded records`}
          >
            <div className="object-record-row object-record-head" role="row">
              <span role="columnheader">Record</span>
              <span role="columnheader">State</span>
              <span role="columnheader">Owner</span>
              <span role="columnheader">Version</span>
              <span role="columnheader">Updated</span>
              <span role="columnheader">Actions</span>
            </div>
            {rows.map((record) => (
              <div className="object-record-row" role="row" key={record.id}>
                <span role="cell" data-label="Record">
                  <strong>{record.label}</strong>
                  <small>{record.id}</small>
                </span>
                <span role="cell" data-label="State">
                  <Pill
                    tone={
                      record.state.toLowerCase().includes("fail") ||
                      record.state.toLowerCase().includes("block")
                        ? "danger"
                        : "info"
                    }
                  >
                    {record.state}
                  </Pill>
                </span>
                <span role="cell" data-label="Owner">
                  {record.owner}
                </span>
                <span role="cell" data-label="Version">
                  v{record.version}
                </span>
                <span role="cell" data-label="Updated">
                  {record.updatedAt}
                </span>
                <span role="cell" data-label="Actions">
                  <NavLink
                    className="table-link"
                    to={`${objectListPath(object)}/${record.id}`}
                  >
                    <Eye size={14} /> Detail
                  </NavLink>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="object-empty">
            <LockKeyhole size={24} />
            <strong>No records in your row scope</strong>
            <span>
              The object is visible, but no seeded record matches this persona’s
              authorized population.
            </span>
          </div>
        )}
      </section>
      <div className="object-two-column">
        <section className="panel object-mini-contract">
          <div className="panel-heading">
            <div>
              <h2>Page-state contract</h2>
              <span>All variants are routed and permission checked</span>
            </div>
            <Pill tone="success">4/4</Pill>
          </div>
          <div className="page-contract-grid">
            <span>
              <strong>List</strong>Scoped collection, search and empty state
            </span>
            <span>
              <strong>New</strong>Writable fields, defaults and validation
            </span>
            <span>
              <strong>Detail</strong>Field visibility, history and relationships
            </span>
            <span>
              <strong>Edit</strong>Version-aware permitted mutation
            </span>
          </div>
        </section>
        <section className="panel object-mini-contract">
          <div className="panel-heading">
            <div>
              <h2>Field contract</h2>
              <span>Business and governance fields stay distinct</span>
            </div>
            <Pill tone="info">{object.dataPoints.length} fields</Pill>
          </div>
          <dl className="fact-list">
            <div>
              <dt>Business fields</dt>
              <dd>
                {
                  object.dataPoints.filter(
                    (field) => field.category === "Business",
                  ).length
                }
              </dd>
            </div>
            <div>
              <dt>Governance fields</dt>
              <dd>
                {
                  object.dataPoints.filter(
                    (field) => field.category === "Governance",
                  ).length
                }
              </dd>
            </div>
            <div>
              <dt>Readable fields</dt>
              <dd>
                {
                  object.dataPoints.filter(
                    (field) => fieldAccessForRole(persona.role, field).read,
                  ).length
                }
              </dd>
            </div>
            <div>
              <dt>Editable fields</dt>
              <dd>
                {
                  object.dataPoints.filter(
                    (field) => fieldAccessForRole(persona.role, field).write,
                  ).length
                }
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}

function ObjectForm({
  object,
  recordId,
  mode,
}: {
  object: ObjectContract;
  recordId?: string;
  mode: "new" | "edit";
}) {
  const navigate = useNavigate();
  const { persona, objectRecords, createObjectRecord, updateObjectRecord } =
    usePrototype();
  const record = objectRecords.find(
    (item) => item.id === recordId && item.objectId === object.id,
  );
  const rowAuthorized = record
    ? recordsForRole(persona.role, persona.id, object, objectRecords).some(
        (item) => item.id === record.id,
      )
    : true;
  const writableFields = object.dataPoints.filter(
    (field) => fieldAccessForRole(persona.role, field).write,
  );
  const [label, setLabel] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  useEffect(() => {
    setLabel(record?.label ?? `New ${object.name}`);
    setValues(
      Object.fromEntries(
        writableFields.map((field) => [
          field.key,
          record?.values[field.key] ??
            (field.key === "lifecycle_state"
              ? object.states[0]
              : field.sampleValue),
        ]),
      ),
    );
    setError("");
  }, [object.id, record?.id, mode, persona.role]);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!label.trim()) {
      setError("Record name is required.");
      return;
    }
    if (mode === "edit" && record) {
      updateObjectRecord(record.id, label.trim(), values);
      navigate(`${objectListPath(object)}/${record.id}`);
      return;
    }
    const newId = createObjectRecord(object.id, label.trim(), values);
    navigate(`${objectListPath(object)}/${newId}`);
  };
  if (mode === "edit" && !record)
    return (
      <div className="panel access-denied" role="alert">
        <LockKeyhole size={24} />
        <div>
          <h2>Record not found in this object</h2>
          <p>
            Return to the role-scoped collection and choose an available record.
          </p>
        </div>
        <NavLink className="primary-button" to={objectListPath(object)}>
          Return to list
        </NavLink>
      </div>
    );
  if (mode === "edit" && !rowAuthorized)
    return (
      <div className="panel access-denied" role="alert">
        <LockKeyhole size={24} />
        <div>
          <h2>Row access denied safely</h2>
          <p>
            {persona.role} cannot edit this {object.name} because it is outside
            the authorized population.
          </p>
        </div>
        <NavLink className="primary-button" to={objectListPath(object)}>
          Return to role-scoped list
        </NavLink>
      </div>
    );
  if (!canCreateObject(persona.role, object) || !writableFields.length)
    return (
      <div className="panel access-denied" role="alert">
        <LockKeyhole size={24} />
        <div>
          <h2>Mutation is not permitted</h2>
          <p>
            {persona.role} has read-only or no-field-write access for{" "}
            {object.name}.
          </p>
        </div>
        <NavLink className="primary-button" to={objectListPath(object)}>
          Return to list
        </NavLink>
      </div>
    );
  return (
    <form className="panel object-form" onSubmit={submit} noValidate>
      <div className="panel-heading">
        <div>
          <h2>
            {mode === "new" ? `New ${object.name}` : `Edit ${record?.label}`}
          </h2>
          <span>
            {mode === "new"
              ? "Create an in-memory synthetic record"
              : `Expected version v${record?.version}`}
          </span>
        </div>
        <Pill tone="warning">{writableFields.length} writable fields</Pill>
      </div>
      {error && (
        <div className="error-summary" role="alert">
          <strong>Check the form</strong>
          <span>{error}</span>
        </div>
      )}
      <div className="object-form-grid">
        <label className="full-field">
          <span>
            Record name <strong aria-hidden="true">*</strong>
          </span>
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            required
          />
        </label>
        {writableFields.map((field) => (
          <label
            key={field.id}
            className={field.type.includes("Long") ? "full-field" : ""}
          >
            <span>
              {field.label}
              <small>
                {field.id} · {field.category}
              </small>
            </span>
            {field.key === "lifecycle_state" ? (
              <select
                value={values[field.key] ?? ""}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [field.key]: event.target.value,
                  }))
                }
              >
                {object.states.map((state) => (
                  <option key={state}>{state}</option>
                ))}
              </select>
            ) : field.type.includes("Long") ? (
              <textarea
                value={values[field.key] ?? ""}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [field.key]: event.target.value,
                  }))
                }
              />
            ) : (
              <input
                value={values[field.key] ?? ""}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [field.key]: event.target.value,
                  }))
                }
              />
            )}
            <small>
              {field.requiredWhen} · {field.qualityRule}
            </small>
          </label>
        ))}
      </div>
      <div className="object-form-actions">
        <NavLink
          className="secondary-button"
          to={
            record
              ? `${objectListPath(object)}/${record.id}`
              : objectListPath(object)
          }
        >
          Cancel
        </NavLink>
        <button className="primary-button" type="submit">
          <CheckCircle2 size={16} />{" "}
          {mode === "new"
            ? "Create synthetic record"
            : "Save permitted changes"}
        </button>
      </div>
    </form>
  );
}

function ObjectDetail({
  object,
  recordId,
}: {
  object: ObjectContract;
  recordId: string;
}) {
  const { persona, objectRecords } = usePrototype();
  const record = objectRecords.find(
    (item) => item.id === recordId && item.objectId === object.id,
  );
  if (!record)
    return (
      <div className="panel access-denied" role="alert">
        <LockKeyhole size={24} />
        <div>
          <h2>Record unavailable</h2>
          <p>
            The record does not exist in this object or is outside the current
            synthetic scope.
          </p>
        </div>
        <NavLink className="primary-button" to={objectListPath(object)}>
          Return to list
        </NavLink>
      </div>
    );
  const scopedRecords = recordsForRole(
    persona.role,
    persona.id,
    object,
    objectRecords,
  );
  if (!scopedRecords.some((item) => item.id === record.id))
    return (
      <div className="panel access-denied" role="alert">
        <LockKeyhole size={24} />
        <div>
          <h2>Row access denied safely</h2>
          <p>
            {persona.role} may open {object.name}, but this record is outside
            the authorized population.
          </p>
        </div>
        <NavLink className="primary-button" to={objectListPath(object)}>
          Return to role-scoped list
        </NavLink>
      </div>
    );
  const readableFields = object.dataPoints.filter(
    (field) => fieldAccessForRole(persona.role, field).read,
  );
  const editableFields = readableFields.filter(
    (field) => fieldAccessForRole(persona.role, field).write,
  );
  return (
    <div className="object-detail-page">
      <div className="object-workspace-toolbar">
        <NavLink className="text-button" to={objectListPath(object)}>
          <ArrowLeft size={15} /> {object.name} list
        </NavLink>
        {editableFields.length ? (
          <NavLink
            className="primary-button"
            to={`${objectListPath(object)}/${record.id}/edit`}
          >
            <Edit3 size={16} /> Edit permitted fields
          </NavLink>
        ) : (
          <button className="secondary-button" disabled>
            <LockKeyhole size={16} /> Read only
          </button>
        )}
      </div>
      <section className="panel object-record-hero">
        <div>
          <span className="object-icon">
            <Database size={22} />
          </span>
          <div>
            <span className="eyebrow">
              {object.id} · {record.id}
            </span>
            <h2>{record.label}</h2>
            <small>
              {object.domain} · {object.lifecycleType}
            </small>
          </div>
        </div>
        <div className="record-hero-status">
          <Pill tone="info">{record.state}</Pill>
          <span>
            v{record.version} · {record.updatedAt}
          </span>
        </div>
      </section>
      <section className="panel object-field-panel">
        <div className="panel-heading">
          <div>
            <h2>Field-level detail</h2>
            <span>
              {readableFields.length} readable · {editableFields.length}{" "}
              editable for {persona.role}
            </span>
          </div>
          <Pill tone="success">Purpose checked</Pill>
        </div>
        <div className="object-field-grid">
          {readableFields.map((field) => (
            <div key={field.id}>
              <span>
                {field.label}
                <small>
                  {field.id} · {field.category}
                </small>
              </span>
              <strong>{record.values[field.key] || "Not populated"}</strong>
              <div>
                <Pill tone="info">Read</Pill>
                <Pill
                  tone={
                    fieldAccessForRole(persona.role, field).write
                      ? "success"
                      : "neutral"
                  }
                >
                  {fieldAccessForRole(persona.role, field).write
                    ? "Edit"
                    : "Locked"}
                </Pill>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="object-two-column">
        <section className="panel object-history">
          <div className="panel-heading">
            <div>
              <History size={17} />
              <h2>Record history</h2>
              <span>Version-preserving synthetic evidence</span>
            </div>
          </div>
          {record.history.map((entry) => (
            <div className="history-entry" key={`${entry.version}-${entry.at}`}>
              <span>v{entry.version}</span>
              <div>
                <strong>{entry.action}</strong>
                <small>
                  {entry.actor} · {entry.at}
                </small>
              </div>
            </div>
          ))}
        </section>
        <section className="panel object-history">
          <div className="panel-heading">
            <div>
              <KeyRound size={17} />
              <h2>Relationships & commands</h2>
              <span>Metadata-driven safeguards</span>
            </div>
          </div>
          <ul>
            {object.relationships.map((relationship) => (
              <li key={relationship}>
                <CheckCircle2 size={14} />
                {relationship}
              </li>
            ))}
          </ul>
          <div className="command-chips">
            {object.commands.map((command) => (
              <span key={command}>{command}</span>
            ))}
          </div>
        </section>
      </div>
      <section className="panel object-related">
        <div className="panel-heading">
          <div>
            <ShieldCheck size={17} />
            <h2>Related object families</h2>
            <span>Same domain; still separately authorized</span>
          </div>
        </div>
        <div>
          {objectCatalog
            .filter(
              (item) =>
                item.domain === object.domain &&
                item.id !== object.id &&
                canReadObject(persona.role, item),
            )
            .slice(0, 6)
            .map((item) => (
              <NavLink to={objectListPath(item)} key={item.id}>
                <Database size={15} />
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.id}</small>
                </span>
                <ArrowRight size={14} />
              </NavLink>
            ))}
        </div>
      </section>
    </div>
  );
}

export function ObjectWorkspace() {
  const { objectSlug: slug, recordId, action } = useParams();
  const { persona } = usePrototype();
  if (!slug) return <ObjectMatrix />;
  const object = objectForSlug(slug);
  if (!object)
    return (
      <div className="panel access-denied" role="alert">
        <Database size={24} />
        <div>
          <h2>Object family not found</h2>
          <p>
            The requested object slug does not exist in the governed catalog.
          </p>
        </div>
        <NavLink className="primary-button" to="/hr/objects">
          Open object matrix
        </NavLink>
      </div>
    );
  if (!canReadObject(persona.role, object))
    return (
      <div className="panel access-denied" role="alert">
        <LockKeyhole size={24} />
        <div>
          <h2>Object access denied safely</h2>
          <p>
            {persona.role} is not assigned to the {object.name} purpose
            boundary.
          </p>
        </div>
        <NavLink className="primary-button" to="/hr/objects">
          Open permitted objects
        </NavLink>
      </div>
    );
  if (recordId === "new") return <ObjectForm object={object} mode="new" />;
  if (action === "edit")
    return <ObjectForm object={object} recordId={recordId} mode="edit" />;
  if (recordId) return <ObjectDetail object={object} recordId={recordId} />;
  return <ObjectList object={object} />;
}

export const objectWorkspaceCoverage = {
  templates: ["List", "New", "Detail", "Edit"],
  objectFamilies: objectCatalogSummary.families,
  routedInstances: objectCatalogSummary.families * 4,
};
