import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Braces,
  CheckCircle2,
  Database,
  GitBranch,
  KeyRound,
  Search,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import {
  lifecycleTypes,
  objectCatalog,
  objectCatalogSummary,
  objectDomains,
} from "../data/objectCatalog";
import {
  atomicConcepts,
  canonicalDataModelSummary,
  conceptsForFamily,
  relationshipsForConcept,
  transitionsForConcept,
} from "../data/canonicalDataModel";
import { ExplainPanel, Pill } from "./Common";

export function ObjectDataStudio({
  announce,
}: {
  announce: (message: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("all");
  const [lifecycle, setLifecycle] = useState("all");
  const [selectedId, setSelectedId] = useState("OBJ-001");
  const [selectedConceptId, setSelectedConceptId] = useState("CON-001");
  const visible = useMemo(
    () =>
      objectCatalog.filter((item) => {
        const matchesQuery =
          !query.trim() ||
          `${item.id} ${item.name} ${item.domain} ${item.dataGroups.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase());
        return (
          matchesQuery &&
          (domain === "all" || item.domain === domain) &&
          (lifecycle === "all" || item.lifecycleType === lifecycle)
        );
      }),
    [domain, lifecycle, query],
  );
  useEffect(() => {
    if (visible.length && !visible.some((item) => item.id === selectedId))
      setSelectedId(visible[0].id);
  }, [selectedId, visible]);
  const selected =
    objectCatalog.find((item) => item.id === selectedId) ?? objectCatalog[0];
  const familyConcepts = conceptsForFamily(selected.id);
  useEffect(() => {
    if (
      familyConcepts.length &&
      !familyConcepts.some((concept) => concept.id === selectedConceptId)
    )
      setSelectedConceptId(familyConcepts[0].id);
  }, [familyConcepts, selectedConceptId]);
  const selectedConcept =
    atomicConcepts.find((concept) => concept.id === selectedConceptId) ??
    familyConcepts[0] ??
    atomicConcepts[0];
  const conceptRelationships = relationshipsForConcept(selectedConcept.name);
  const conceptTransitions = transitionsForConcept(selectedConcept.name);
  const coverage = Math.round(
    (objectCatalogSummary.lifecycleClassified / objectCatalogSummary.families) *
      100,
  );

  return (
    <div className="object-data-studio">
      <section
        className="object-contract-summary"
        aria-label="Object and data contract coverage"
      >
        <article>
          <Workflow size={20} />
          <span>
            <strong>
              {objectCatalogSummary.lifecycleClassified}/
              {objectCatalogSummary.families}
            </strong>
            Lifecycle classified
          </span>
          <Pill tone="success">{coverage}%</Pill>
        </article>
        <article>
          <Database size={20} />
          <span>
            <strong>{objectCatalogSummary.logicalDataGroups}/48</strong>DAT
            groups mapped
          </span>
          <Pill tone="success">100%</Pill>
        </article>
        <article>
          <Braces size={20} />
          <span>
            <strong>{canonicalDataModelSummary.atomicConcepts}</strong>Atomic
            concepts
          </span>
          <Pill tone="info">
            {canonicalDataModelSummary.inheritedAtomicConcepts} inherited +{" "}
            {canonicalDataModelSummary.supportingConcepts} supporting
          </Pill>
        </article>
        <article>
          <GitBranch size={20} />
          <span>
            <strong>
              {objectCatalogSummary.relationshipClassified}/
              {objectCatalogSummary.families}
            </strong>
            Relationships classified
          </span>
          <Pill tone="success">100%</Pill>
        </article>
        <article>
          <KeyRound size={20} />
          <span>
            <strong>{canonicalDataModelSummary.atomicFields}</strong>Atomic field
            contracts
          </span>
          <Pill tone="info">
            {canonicalDataModelSummary.businessFields} business
          </Pill>
        </article>
        <article>
          <ShieldCheck size={20} />
          <span>
            <strong>{canonicalDataModelSummary.physicalObjectsApproved}</strong>
            Physical objects approved
          </span>
          <Pill tone="warning">Disposition proposed</Pill>
        </article>
      </section>

      <section
        className="object-contract-filters"
        aria-label="Object contract filters"
      >
        <label className="object-search">
          <Search size={16} />
          <span className="sr-only">Search object and data catalog</span>
          <input
            aria-label="Search object and data catalog"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search object, domain or DAT group"
          />
        </label>
        <label>
          <span>Domain</span>
          <select
            aria-label="Object domain filter"
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
          >
            <option value="all">All 12 domains</option>
            {objectDomains.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Lifecycle type</span>
          <select
            aria-label="Object lifecycle filter"
            value={lifecycle}
            onChange={(event) => setLifecycle(event.target.value)}
          >
            <option value="all">All lifecycle types</option>
            {lifecycleTypes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <span role="status">
          {visible.length} of {objectCatalog.length} families
        </span>
      </section>

      <div className="object-contract-workbench">
        <section className="panel object-catalog-list">
          <div className="panel-heading">
            <div>
              <h2>Logical object catalogue</h2>
              <span>92 families · 111 expanded concepts</span>
            </div>
            <Pill tone="info">Select a family</Pill>
          </div>
          <div
            className="object-list"
            role="listbox"
            aria-label="Logical object families"
          >
            {visible.map((item) => (
              <button
                role="option"
                aria-selected={item.id === selected.id}
                className={item.id === selected.id ? "selected" : ""}
                onClick={() => setSelectedId(item.id)}
                key={item.id}
              >
                <span className="object-code">{item.id}</span>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.domain}</small>
                </span>
                <Pill>{item.lifecycleType.replace(" / projection", "")}</Pill>
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
          {!visible.length && (
            <div className="object-empty">
              <Database size={24} />
              <strong>No object families match</strong>
              <span>Clear or change the catalogue filters.</span>
            </div>
          )}
        </section>

        <section className="panel object-contract-detail" aria-live="polite">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">
                {selected.id} · {selected.domain}
              </span>
              <h2>{selected.name}</h2>
              <span>{selected.grain}</span>
            </div>
            <div className="chip-row">
              <Pill tone="info">{selected.lifecycleType}</Pill>
              <Pill tone="success">Canonical contract v1.9</Pill>
            </div>
          </div>
          <div className="object-fact-grid">
            <div>
              <span>Source of truth</span>
              <strong>{selected.sourceOfTruth}</strong>
            </div>
            <div>
              <span>Accountable owner</span>
              <strong>{selected.owner}</strong>
            </div>
            <div>
              <span>Classification</span>
              <strong>{selected.classification}</strong>
            </div>
            <div>
              <span>Retention</span>
              <strong>{selected.retention}</strong>
            </div>
          </div>

          <section className="object-subsection">
            <div className="object-subheading">
              <Database size={17} />
              <div>
                <h3>Atomic concepts and physical disposition</h3>
                <span>
                  Family navigation is separated from persisted record grain
                </span>
              </div>
            </div>
            <div className="command-chips">
              {familyConcepts.map((concept) => (
                <button
                  className={
                    concept.id === selectedConcept.id
                      ? "primary-button"
                      : "secondary-button"
                  }
                  onClick={() => setSelectedConceptId(concept.id)}
                  key={concept.id}
                >
                  {concept.name}
                </button>
              ))}
            </div>
            <div className="object-fact-grid">
              <div>
                <span>Atomic grain</span>
                <strong>{selectedConcept.grain}</strong>
              </div>
              <div>
                <span>Concept kind</span>
                <strong>{selectedConcept.kind}</strong>
              </div>
              <div>
                <span>Proposed persistence</span>
                <strong>{selectedConcept.persistenceTarget}</strong>
              </div>
              <div>
                <span>Proposed API name</span>
                <strong>{selectedConcept.proposedApiName}</strong>
              </div>
            </div>
            <p>
              {selectedConcept.physicalDisposition}.{" "}
              {selectedConcept.approvalStatus}.
            </p>
          </section>

          <section className="object-subsection">
            <div className="object-subheading">
              <Workflow size={17} />
              <div>
                <h3>Lifecycle flow</h3>
                <span>
                  Allowed state vocabulary; commands still enforce prerequisites
                </span>
              </div>
            </div>
            <ol className="object-lifecycle">
              {selectedConcept.stateVocabulary.map((state, index) => (
                <li key={state}>
                  <span>{index + 1}</span>
                  <strong>{state}</strong>
                  {index < selectedConcept.stateVocabulary.length - 1 && (
                    <ArrowRight size={15} />
                  )}
                </li>
              ))}
            </ol>
          </section>

          <div className="object-two-column">
            <section className="object-subsection">
              <div className="object-subheading">
                <GitBranch size={17} />
                <div>
                  <h3>Relationships and invariants</h3>
                  <span>Parent, cardinality and separation rules</span>
                </div>
              </div>
              <ul>
                {conceptRelationships.slice(0, 8).map((relationship) => (
                  <li key={relationship.id}>
                    <CheckCircle2 size={15} />
                    {relationship.from}.{relationship.field} →{" "}
                    {relationship.to} · {relationship.cardinality} ·{" "}
                    {relationship.deleteBehavior}
                  </li>
                ))}
              </ul>
            </section>
            <section className="object-subsection">
              <div className="object-subheading">
                <KeyRound size={17} />
                <div>
                  <h3>Permitted command classes</h3>
                  <span>
                    Authorization is checked per actor, purpose and state
                  </span>
                </div>
              </div>
              <div className="command-chips">
                {conceptTransitions.slice(0, 8).map((transition) => (
                  <span key={transition.id}>
                    {transition.from} → {transition.to}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <section className="object-subsection">
            <div className="object-subheading">
              <Braces size={17} />
              <div>
                <h3>Atomic business and governance fields</h3>
                <span>
                  Object-specific business fields plus shared governance,
                  provenance, security and lifecycle contracts
                </span>
              </div>
            </div>
            <div
              className="data-point-table"
              role="table"
              aria-label={`${selectedConcept.name} atomic field contracts`}
            >
              <div role="row" className="data-point-row data-point-head">
                <span role="columnheader">Field ID</span>
                <span role="columnheader">Data point</span>
                <span role="columnheader">Type</span>
                <span role="columnheader">Required</span>
                <span role="columnheader">Source</span>
                <span role="columnheader">Quality rule</span>
              </div>
              {selectedConcept.fields.map((field) => (
                <div role="row" className="data-point-row" key={field.id}>
                  <code role="cell" data-label="Field ID">
                    {field.id}
                  </code>
                  <span role="cell" data-label="Data point">
                    <strong>{field.label}</strong>
                    <small>
                      {field.key} · {field.category} · {field.provenance}
                    </small>
                  </span>
                  <span role="cell" data-label="Type">
                    {field.dataType}
                  </span>
                  <span role="cell" data-label="Required">
                    {field.requiredWhen}
                  </span>
                  <span role="cell" data-label="Source">
                    {field.source}
                  </span>
                  <span role="cell" data-label="Quality rule">
                    {field.validation}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="object-two-column">
            <section className="object-subsection">
              <div className="object-subheading">
                <ShieldCheck size={17} />
                <div>
                  <h3>Persona and purpose boundary</h3>
                  <span>Eligibility never grants every physical field</span>
                </div>
              </div>
              <div className="command-chips">
                {selected.personas.map((persona) => (
                  <span key={persona}>{persona}</span>
                ))}
              </div>
              <div className="dat-mapping">
                <strong>Mapped groups</strong>
                {selected.dataGroups.map((group) => (
                  <code key={group}>{group}</code>
                ))}
              </div>
            </section>
            <section className="object-subsection">
              <div className="object-subheading">
                <CheckCircle2 size={17} />
                <div>
                  <h3>Data-quality gates</h3>
                  <span>
                    A failure blocks consequential use and creates owned work
                  </span>
                </div>
              </div>
              <ul>
                {selected.dataQuality.map((rule) => (
                  <li key={rule}>
                    <CheckCircle2 size={15} />
                    {rule}
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <button
            className="secondary-button full-button"
            onClick={() =>
              announce(
                `${selectedConcept.id} canonical contract package prepared in memory; its Salesforce disposition remains proposed and no metadata was deployed.`,
              )
            }
          >
            Preview traceability package
          </button>
        </section>
      </div>
      <ExplainPanel
        title="Logical coverage, physical gate retained"
        source="CON/AFLD/REL/DTR canonical model · v1.9"
      >
        The 92 navigation families now resolve to 111 inherited atomic concepts
        plus 18 supporting control concepts. Every atomic concept has a precise
        grain, object-specific fields, structured relationships, transitions,
        security metadata, analytics lineage and a proposed persistence
        disposition. Physical Salesforce deployment and accountable approval
        remain intentionally separate gates.
      </ExplainPanel>
    </div>
  );
}
