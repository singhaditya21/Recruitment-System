import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { CandidatePortal } from "./components/CandidatePortal";
import { HrWorkspace } from "./components/HrWorkspace";
import { PrototypeProvider, usePrototype } from "./prototype/PrototypeContext";

function PrototypeRoutes() {
  const { resetKey } = usePrototype();
  return (
    <Routes key={resetKey}>
      <Route path="/" element={<Navigate replace to="/careers" />} />
      <Route path="/careers" element={<CandidatePortal screen="careers" />} />
      <Route
        path="/careers/jobs/:publicId"
        element={<CandidatePortal screen="job" />}
      />
      <Route
        path="/apply/:publicId/*"
        element={<CandidatePortal screen="apply" />}
      />
      <Route
        path="/my-applications"
        element={<CandidatePortal screen="hub" />}
      />
      <Route
        path="/my-applications/:id"
        element={<CandidatePortal screen="hub" />}
      />
      <Route
        path="/hr/action-center"
        element={<HrWorkspace screen="actions" />}
      />
      <Route
        path="/hr/analytics"
        element={<HrWorkspace screen="analytics" />}
      />
      <Route path="/hr/reports" element={<HrWorkspace screen="reports" />} />
      <Route path="/hr/objects" element={<HrWorkspace screen="objects" />} />
      <Route
        path="/hr/objects/:objectSlug"
        element={<HrWorkspace screen="objects" />}
      />
      <Route
        path="/hr/objects/:objectSlug/:recordId"
        element={<HrWorkspace screen="objects" />}
      />
      <Route
        path="/hr/objects/:objectSlug/:recordId/:action"
        element={<HrWorkspace screen="objects" />}
      />
      <Route path="/hr/jobs" element={<HrWorkspace screen="job" />} />
      <Route path="/hr/jobs/:jobId" element={<HrWorkspace screen="job" />} />
      <Route
        path="/hr/jobs/:jobId/:action"
        element={<HrWorkspace screen="job" />}
      />
      <Route
        path="/hr/candidates"
        element={<HrWorkspace screen="candidate" />}
      />
      <Route
        path="/hr/candidates/:candidateId"
        element={<HrWorkspace screen="candidate" />}
      />
      <Route
        path="/hr/candidates/:candidateId/:action"
        element={<HrWorkspace screen="candidate" />}
      />
      <Route
        path="/hr/applications"
        element={<HrWorkspace screen="application" />}
      />
      <Route
        path="/hr/applications/:applicationId"
        element={<HrWorkspace screen="application" />}
      />
      <Route
        path="/hr/applications/:applicationId/:action"
        element={<HrWorkspace screen="application" />}
      />
      <Route
        path="/hr/interviews"
        element={<HrWorkspace screen="interview" />}
      />
      <Route
        path="/hr/interviews/:interviewId"
        element={<HrWorkspace screen="interview" />}
      />
      <Route
        path="/hr/assignments"
        element={<HrWorkspace screen="scorecard" />}
      />
      <Route
        path="/hr/assignments/:assignmentId"
        element={<HrWorkspace screen="scorecard" />}
      />
      <Route path="/hr/decisions" element={<HrWorkspace screen="decision" />} />
      <Route
        path="/hr/decisions/:applicationId"
        element={<HrWorkspace screen="decision" />}
      />
      <Route
        path="/hr/automations"
        element={<HrWorkspace screen="automations" />}
      />
      <Route
        path="/hr/governance"
        element={<HrWorkspace screen="governance" />}
      />
      <Route path="*" element={<Navigate replace to="/careers" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <PrototypeProvider>
        <PrototypeRoutes />
      </PrototypeProvider>
    </HashRouter>
  );
}
