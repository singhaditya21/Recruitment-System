# Recruitment System

An end-to-end applicant tracking system for a San Francisco–based company, designed around Salesforce as the operational recruitment system of record.

## Product documentation

- [Product Requirements Document](docs/PRD.md)

Development begins with a public GitHub Pages prototype that uses synthetic data only. PRD v0.4 defines the pilot/production architecture: a native Salesforce Lightning workspace for HR, an externally hosted candidate portal through a secure backend-for-frontend, individual opening/headcount records, governed recruiting work, complete interview/offer/contingency/hire-handoff states, and versioned jurisdiction/compliance controls. Candidate documents remain in approved private object storage. GitHub Pages will not handle real authentication, candidate data, resumes, interview feedback, offers, or audit records.
