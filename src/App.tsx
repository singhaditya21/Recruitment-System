import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { CandidatePortal } from "./components/CandidatePortal";
import { HrWorkspace } from "./components/HrWorkspace";
import { NewHirePortal } from "./components/NewHirePortal";
import { RolePortal } from "./components/RolePortals";
import { CandidateSystemWorkspace } from "./components/CandidateSystemWorkspace";
import { RecruitingOperationsV3 } from "./components/RecruitingOperationsV3";
import { AdditionalPortalsV3 } from "./components/AdditionalPortalsV3";
import { LifecycleV3 } from "./components/LifecycleV3";
import { AdminOperationsV3 } from "./components/AdminOperationsV3";
import { PrototypeProvider, usePrototype } from "./prototype/PrototypeContext";

function PrototypeRoutes() {
  const { resetKey } = usePrototype();
  return (
    <Routes key={resetKey}>
      <Route path="/" element={<Navigate replace to="/careers" />} />
      <Route path="/careers" element={<CandidatePortal screen="careers" />} />
      <Route path="/sign-in" element={<CandidateSystemWorkspace />} />
      <Route path="/sign-in/magic-link" element={<CandidateSystemWorkspace />} />
      <Route path="/sign-in/expired" element={<CandidateSystemWorkspace />} />
      <Route path="/account-recovery" element={<CandidateSystemWorkspace />} />
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
      <Route path="/saved-jobs" element={<CandidatePortal screen="relationship" />} />
      <Route path="/job-alerts" element={<CandidatePortal screen="relationship" />} />
      <Route path="/job-alerts/new" element={<CandidateSystemWorkspace />} />
      <Route path="/job-alerts/:alertId" element={<CandidateSystemWorkspace />} />
      <Route path="/job-alerts/:alertId/edit" element={<CandidateSystemWorkspace />} />
      <Route path="/events" element={<CandidatePortal screen="relationship" />} />
      <Route path="/events/:eventId" element={<CandidatePortal screen="relationship" />} />
      <Route path="/events/:eventId/ticket" element={<CandidateSystemWorkspace />} />
      <Route path="/events/:eventId/feedback" element={<CandidateSystemWorkspace />} />
      <Route path="/my-tasks" element={<CandidatePortal screen="tasks" />} />
      <Route path="/my-tasks/:taskId" element={<CandidateSystemWorkspace />} />
      <Route path="/support" element={<CandidateSystemWorkspace />} />
      <Route path="/support/new" element={<CandidateSystemWorkspace />} />
      <Route path="/support/:caseId" element={<CandidateSystemWorkspace />} />
      <Route path="/privacy-requests" element={<CandidateSystemWorkspace />} />
      <Route path="/privacy-requests/new" element={<CandidateSystemWorkspace />} />
      <Route path="/privacy-requests/:requestId" element={<CandidateSystemWorkspace />} />
      <Route path="/preboarding" element={<NewHirePortal />} />
      <Route path="/preboarding/tasks" element={<NewHirePortal />} />
      <Route path="/preboarding/tasks/:taskId" element={<NewHirePortal />} />
      <Route path="/preboarding/documents" element={<NewHirePortal />} />
      <Route path="/preboarding/profile" element={<NewHirePortal />} />
      <Route path="/preboarding/day-one" element={<NewHirePortal />} />
      <Route path="/preboarding/journey" element={<NewHirePortal />} />
      <Route path="/preboarding/help" element={<NewHirePortal />} />
      <Route path="/preboarding/benefits" element={<LifecycleV3 />} />
      <Route path="/preboarding/benefits/:benefitId" element={<LifecycleV3 />} />
      <Route path="/preboarding/learning" element={<LifecycleV3 />} />
      <Route path="/preboarding/learning/:learningId" element={<LifecycleV3 />} />
      <Route path="/preboarding/country/:localeId" element={<LifecycleV3 />} />
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
      <Route
        path="/hr/onboarding"
        element={<HrWorkspace screen="onboarding" />}
      />
      <Route
        path="/hr/onboarding/new-hires"
        element={<HrWorkspace screen="onboarding" />}
      />
      <Route
        path="/hr/onboarding/programs"
        element={<HrWorkspace screen="onboarding" />}
      />
      <Route
        path="/hr/onboarding/new-hires/:newHireId"
        element={<HrWorkspace screen="onboarding" />}
      />
      <Route
        path="/hr/onboarding/templates"
        element={<HrWorkspace screen="onboarding" />}
      />
      <Route
        path="/hr/onboarding/compliance"
        element={<HrWorkspace screen="onboarding" />}
      />
      <Route
        path="/hr/onboarding/exceptions"
        element={<HrWorkspace screen="onboarding" />}
      />
      <Route
        path="/hr/onboarding/provisioning"
        element={<HrWorkspace screen="onboarding" />}
      />
      <Route
        path="/hr/onboarding/experience"
        element={<HrWorkspace screen="onboarding" />}
      />
      <Route
        path="/hr/onboarding/analytics"
        element={<HrWorkspace screen="onboarding" />}
      />
      <Route path="/hr/talent" element={<HrWorkspace screen="talent" />} />
      <Route path="/hr/talent/:talentView" element={<HrWorkspace screen="talent" />} />
      <Route path="/hr/cases" element={<HrWorkspace screen="cases" />} />
      <Route path="/hr/cases/:caseId" element={<HrWorkspace screen="cases" />} />
      <Route path="/hr/high-volume" element={<HrWorkspace screen="high-volume" />} />
      <Route path="/hr/high-volume/:campaignId" element={<RecruitingOperationsV3 />} />
      <Route path="/hr/high-volume/:campaignId/planning" element={<RecruitingOperationsV3 />} />
      <Route path="/hr/high-volume/:campaignId/analytics" element={<RecruitingOperationsV3 />} />
      <Route path="/hr/high-volume/:campaignId/cohorts/:cohortId" element={<RecruitingOperationsV3 />} />
      <Route path="/hr/events" element={<RecruitingOperationsV3 />} />
      <Route path="/hr/events/new" element={<RecruitingOperationsV3 />} />
      <Route path="/hr/events/:eventId" element={<RecruitingOperationsV3 />} />
      <Route path="/hr/events/:eventId/edit" element={<RecruitingOperationsV3 />} />
      <Route path="/hr/events/:eventId/check-in" element={<RecruitingOperationsV3 />} />
      <Route path="/hr/locales" element={<HrWorkspace screen="high-volume" />} />
      <Route path="/hr/locales/:localeId" element={<RecruitingOperationsV3 />} />
      <Route path="/hr/locales/:localeId/edit" element={<RecruitingOperationsV3 />} />
      <Route path="/hr/recovery" element={<HrWorkspace screen="high-volume" />} />
      <Route path="/hr/recovery/:recoveryId" element={<RecruitingOperationsV3 />} />
      <Route path="/hr/agency-assignments" element={<RecruitingOperationsV3 />} />
      <Route path="/hr/agency-assignments/new" element={<RecruitingOperationsV3 />} />
      <Route path="/hr/agency-assignments/partners" element={<RecruitingOperationsV3 />} />
      <Route path="/hr/agency-assignments/:assignmentId" element={<RecruitingOperationsV3 />} />
      <Route path="/hr/agency-assignments/:assignmentId/edit" element={<RecruitingOperationsV3 />} />
      <Route path="/hr/transitions" element={<LifecycleV3 />} />
      <Route path="/hr/transitions/new" element={<LifecycleV3 />} />
      <Route path="/hr/transitions/:transitionId" element={<LifecycleV3 />} />
      <Route path="/hr/transitions/:transitionId/edit" element={<LifecycleV3 />} />
      <Route path="/hr/transitions/:transitionId/impact" element={<LifecycleV3 />} />
      <Route path="/hr/platform" element={<HrWorkspace screen="platform" />} />
      <Route path="/hr/platform/:platformView" element={<HrWorkspace screen="platform" />} />
      <Route path="/manager" element={<RolePortal kind="manager" />} />
      <Route path="/manager/new-hires/:newHireId" element={<RolePortal kind="manager" />} />
      <Route path="/manager/recruiting" element={<AdditionalPortalsV3 />} />
      <Route path="/manager/recruiting/:itemId" element={<AdditionalPortalsV3 />} />
      <Route path="/it" element={<RolePortal kind="it" />} />
      <Route path="/it/requests/:requestId" element={<RolePortal kind="it" />} />
      <Route path="/facilities" element={<AdditionalPortalsV3 />} />
      <Route path="/facilities/requests/:requestId" element={<AdditionalPortalsV3 />} />
      <Route path="/agency" element={<RolePortal kind="agency" />} />
      <Route path="/agency/assignments" element={<RolePortal kind="agency" />} />
      <Route path="/agency/assignments/:assignmentId" element={<RolePortal kind="agency" />} />
      <Route path="/agency/submissions" element={<RolePortal kind="agency" />} />
      <Route path="/agency/submissions/new" element={<RolePortal kind="agency" />} />
      <Route path="/agency/submissions/:submissionId" element={<RolePortal kind="agency" />} />
      <Route path="/referrer" element={<AdditionalPortalsV3 />} />
      <Route path="/referrer/new" element={<AdditionalPortalsV3 />} />
      <Route path="/referrer/:referralId" element={<AdditionalPortalsV3 />} />
      <Route path="/referrer/:referralId/dispute" element={<AdditionalPortalsV3 />} />
      <Route path="/interviewer" element={<AdditionalPortalsV3 />} />
      <Route path="/interviewer/:assignmentId" element={<AdditionalPortalsV3 />} />
      <Route path="/buddy" element={<AdditionalPortalsV3 />} />
      <Route path="/buddy/:planId" element={<AdditionalPortalsV3 />} />
      <Route path="/mobility" element={<AdditionalPortalsV3 />} />
      <Route path="/mobility/:opportunityId" element={<AdditionalPortalsV3 />} />
      <Route path="/mobility/:opportunityId/interest" element={<AdditionalPortalsV3 />} />
      <Route path="/admin" element={<AdminOperationsV3 />} />
      <Route path="/admin/users" element={<AdminOperationsV3 />} />
      <Route path="/admin/users/new" element={<AdminOperationsV3 />} />
      <Route path="/admin/users/:userId" element={<AdminOperationsV3 />} />
      <Route path="/admin/users/:userId/edit" element={<AdminOperationsV3 />} />
      <Route path="/admin/access-requests" element={<AdminOperationsV3 />} />
      <Route path="/admin/access-requests/:requestId" element={<AdminOperationsV3 />} />
      <Route path="/admin/notifications" element={<AdminOperationsV3 />} />
      <Route path="/admin/notifications/:notificationId" element={<AdminOperationsV3 />} />
      <Route path="/admin/content" element={<AdminOperationsV3 />} />
      <Route path="/admin/content/new" element={<AdminOperationsV3 />} />
      <Route path="/admin/content/:contentId" element={<AdminOperationsV3 />} />
      <Route path="/admin/content/:contentId/edit" element={<AdminOperationsV3 />} />
      <Route path="/admin/integrations" element={<AdminOperationsV3 />} />
      <Route path="/admin/integrations/:integrationId" element={<AdminOperationsV3 />} />
      <Route path="/admin/integrations/:integrationId/mapping" element={<AdminOperationsV3 />} />
      <Route path="/admin/integrations/:integrationId/credentials" element={<AdminOperationsV3 />} />
      <Route path="/admin/imports" element={<AdminOperationsV3 />} />
      <Route path="/admin/imports/new" element={<AdminOperationsV3 />} />
      <Route path="/admin/imports/:importId" element={<AdminOperationsV3 />} />
      <Route path="/admin/imports/:importId/validate" element={<AdminOperationsV3 />} />
      <Route path="/admin/imports/:importId/correct" element={<AdminOperationsV3 />} />
      <Route path="/admin/identity" element={<AdminOperationsV3 />} />
      <Route path="/admin/privacy-requests" element={<AdminOperationsV3 />} />
      <Route path="/admin/privacy-requests/:requestId" element={<AdminOperationsV3 />} />
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
