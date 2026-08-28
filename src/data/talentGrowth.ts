export type Prospect = {
  id: string;
  name: string;
  initials: string;
  headline: string;
  location: string;
  skills: string[];
  relationship: "New" | "Engaged" | "Warm" | "Do not contact";
  consent: "Recruiting outreach" | "Event only" | "Expired" | "Suppressed";
  source: string;
  owner: string;
  lastTouch: string;
  community: string;
};

export type TalentCampaign = {
  id: string;
  name: string;
  audience: string;
  channel: "Email" | "Event" | "Career site" | "Mixed";
  status: "Draft" | "Scheduled" | "Running" | "Complete";
  members: number;
  delivered: number;
  engaged: number;
  converted: number;
  owner: string;
  purpose: string;
};

export type JobDistribution = {
  id: string;
  jobId: string;
  job: string;
  channel: string;
  audience: "External" | "Internal" | "Agency";
  status: "Published" | "Pending" | "Failed" | "Expired";
  externalId: string;
  publishedAt: string;
  expiresAt: string;
  applications: number;
  qualified: number;
  spend: string;
  lastReconciled: string;
};

export type InternalOpportunity = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Role" | "Gig" | "Mentorship" | "Project";
  manager: string;
  applicants: number;
  visibility: "All employees" | "Eligible populations" | "Invite only";
  closes: string;
  skills: string[];
  mobilityPolicy: string;
};

const prospectNames = [
  "Aarav Mehta", "Olivia Parker", "Ibrahim Hassan", "Emma Collins", "Kenji Sato", "Fatima Noor",
  "Gabriel Silva", "Charlotte Evans", "Rohan Kapoor", "Grace Miller", "Samuel Okafor", "Yuna Park",
  "Theo Laurent", "Zara Ahmed", "Benjamin Foster", "Aisha Bello", "Diego Morales", "Hana Suzuki",
  "Arthur Reed", "Leila Haddad", "Nathan Cooper", "Mei Wong", "Caleb Brooks", "Nadia Ivanova",
] as const;
const headlines = [
  "Product designer · enterprise workflows", "Data engineer · platform reliability",
  "Recruiting operations and analytics", "Security engineer · identity and access",
  "Customer success leader", "Product marketing · B2B SaaS",
] as const;
const locations = ["San Francisco, CA", "New York, NY", "Austin, TX", "Toronto, Canada", "London, UK", "Remote · US"];
const skillSets = [
  ["Systems design", "Accessibility", "Research"], ["Python", "Data platforms", "Reliability"],
  ["Recruiting ops", "Analytics", "Workflow design"], ["IAM", "Cloud security", "Threat modeling"],
  ["Enterprise SaaS", "Enablement", "Renewals"], ["Positioning", "Content", "Go-to-market"],
];

export const prospects: Prospect[] = Array.from({ length: 120 }, (_, index) => {
  const base = prospectNames[index % prospectNames.length];
  const suffix = index >= prospectNames.length ? ` ${Math.floor(index / prospectNames.length) + 1}` : "";
  const name = `${base}${suffix}`;
  const relationship: Prospect["relationship"] = index % 13 === 0 ? "Do not contact" : index % 4 === 0 ? "Warm" : index % 3 === 0 ? "Engaged" : "New";
  const consent: Prospect["consent"] = relationship === "Do not contact" ? "Suppressed" : index % 17 === 0 ? "Expired" : index % 9 === 0 ? "Event only" : "Recruiting outreach";
  return {
    id: `PRO-DEMO-${String(index + 1).padStart(3, "0")}`,
    name,
    initials: base.split(" ").map((word) => word[0]).join(""),
    headline: headlines[index % headlines.length],
    location: locations[index % locations.length],
    skills: skillSets[index % skillSets.length],
    relationship,
    consent,
    source: index % 4 === 0 ? "Talent event" : index % 4 === 1 ? "Referral" : index % 4 === 2 ? "Career community" : "Recruiter research",
    owner: index % 3 === 0 ? "Alex Rivera" : index % 3 === 1 ? "Priya Nair" : "Jordan Lee",
    lastTouch: index % 8 === 0 ? "No touch yet" : `${1 + (index % 28)} days ago`,
    community: index % 4 === 0 ? "Design community" : index % 4 === 1 ? "Engineering alumni" : index % 4 === 2 ? "People Operations network" : "Future leaders",
  };
});

export const talentCommunities = [
  { id: "TCO-001", name: "Design community", members: 412, active90Days: 238, purpose: "Product and design opportunities", owner: "Alex Rivera" },
  { id: "TCO-002", name: "Engineering alumni", members: 634, active90Days: 311, purpose: "Platform, product and security engineering", owner: "Jordan Lee" },
  { id: "TCO-003", name: "People Operations network", members: 188, active90Days: 104, purpose: "Recruiting and People Operations", owner: "Priya Nair" },
  { id: "TCO-004", name: "Future leaders", members: 256, active90Days: 121, purpose: "People-leader opportunities", owner: "Alex Rivera" },
  { id: "TCO-005", name: "Early career", members: 890, active90Days: 504, purpose: "Internship and new-graduate programs", owner: "Priya Nair" },
  { id: "TCO-006", name: "Customer experience", members: 347, active90Days: 179, purpose: "Customer success and support", owner: "Alex Rivera" },
  { id: "TCO-007", name: "Finance and operations", members: 205, active90Days: 96, purpose: "Finance and business operations", owner: "Priya Nair" },
  { id: "TCO-008", name: "Event-only contacts", members: 146, active90Days: 64, purpose: "Specific registered event communications", owner: "Mei Lin" },
] as const;

export const talentCampaigns: TalentCampaign[] = [
  ["CAM-001", "Design systems roundtable", "Design community · West Coast", "Event", "Running", 180, 176, 82, 11, "Alex Rivera"],
  ["CAM-002", "Data platform opportunities", "Data engineering prospects", "Email", "Scheduled", 240, 0, 0, 0, "Jordan Lee"],
  ["CAM-003", "People Operations newsletter", "People Operations network", "Email", "Complete", 164, 158, 74, 8, "Priya Nair"],
  ["CAM-004", "Security careers spotlight", "Security-interest prospects", "Career site", "Running", 94, 91, 38, 6, "Jordan Lee"],
  ["CAM-005", "Women in product community", "Opted-in product prospects", "Mixed", "Draft", 0, 0, 0, 0, "Alex Rivera"],
  ["CAM-006", "Alumni returnship program", "Eligible alumni", "Mixed", "Complete", 128, 121, 67, 9, "Priya Nair"],
].map(([id, name, audience, channel, status, members, delivered, engaged, converted, owner]) => ({
  id: String(id), name: String(name), audience: String(audience), channel: channel as TalentCampaign["channel"], status: status as TalentCampaign["status"],
  members: Number(members), delivered: Number(delivered), engaged: Number(engaged), converted: Number(converted), owner: String(owner),
  purpose: "Consent-scoped recruiting relationship and relevant opportunity communication",
}));

const distributionChannels = [
  ["Harbor & Pine careers", "External"], ["LinkedIn Jobs", "External"], ["Indeed", "External"],
  ["Employee opportunity hub", "Internal"], ["Approved agency portal", "Agency"], ["University network", "External"],
] as const;
const distributedJobs = [
  ["JOB-DEMO-001", "Senior Product Designer"], ["JOB-DEMO-002", "Recruiting Operations Partner"],
  ["JOB-DEMO-003", "Staff Data Platform Engineer"], ["JOB-DEMO-008", "Security Engineer"],
] as const;

export const jobDistributions: JobDistribution[] = Array.from({ length: 24 }, (_, index) => {
  const [jobId, job] = distributedJobs[index % distributedJobs.length];
  const [channel, audience] = distributionChannels[index % distributionChannels.length];
  const status: JobDistribution["status"] = index % 11 === 0 ? "Failed" : index % 7 === 0 ? "Pending" : index % 13 === 0 ? "Expired" : "Published";
  return {
    id: `JDS-DEMO-${String(index + 1).padStart(3, "0")}`,
    jobId, job, channel, audience,
    status,
    externalId: status === "Pending" ? "Awaiting provider" : `EXT-${String(8400 + index)}`,
    publishedAt: `Aug ${18 + (index % 9)}, 2026`,
    expiresAt: `Sep ${18 + (index % 9)}, 2026`,
    applications: 8 + ((index * 13) % 67),
    qualified: 2 + ((index * 5) % 18),
    spend: audience === "External" && channel !== "Harbor & Pine careers" ? `$${150 + index * 25}` : "$0",
    lastReconciled: status === "Failed" ? "Retry due · 18 min" : `${2 + (index % 12)} min ago`,
  };
});

export const internalOpportunities: InternalOpportunity[] = [
  ["IMO-001", "Design Systems Lead", "Product & Research", "US · Remote", "Role", "Marcus Johnson", 9, "All employees", "Sep 12", ["Design systems", "Leadership", "Accessibility"]],
  ["IMO-002", "AI Governance Working Group", "Security", "Global · Remote", "Project", "Aisha Rahman", 18, "Eligible populations", "Sep 8", ["Governance", "Risk", "Facilitation"]],
  ["IMO-003", "Customer Journey Research", "Customer Experience", "US · Hybrid", "Gig", "Priya Shah", 12, "All employees", "Sep 16", ["Research", "Analytics", "Storytelling"]],
  ["IMO-004", "New Manager Mentorship", "People Operations", "Global · Remote", "Mentorship", "Elena Garcia", 24, "Eligible populations", "Sep 20", ["Coaching", "Management", "Feedback"]],
  ["IMO-005", "Data Platform Reliability Lead", "Engineering", "US · Remote", "Role", "Elena Garcia", 6, "All employees", "Sep 15", ["Distributed systems", "Reliability", "Leadership"]],
  ["IMO-006", "Career Site Accessibility Sprint", "Product & Research", "Global · Remote", "Project", "Marcus Johnson", 15, "All employees", "Sep 10", ["Accessibility", "Frontend", "Research"]],
  ["IMO-007", "Finance Automation Discovery", "Finance", "New York · Hybrid", "Gig", "Owen Brooks", 7, "Eligible populations", "Sep 22", ["Finance", "Automation", "Process design"]],
  ["IMO-008", "Executive Shadow Program", "Executive", "San Francisco", "Mentorship", "Nina Patel", 11, "Invite only", "Sep 30", ["Strategy", "Communication", "Leadership"]],
].map(([id, title, department, location, type, manager, applicants, visibility, closes, skills]) => ({
  id: String(id), title: String(title), department: String(department), location: String(location), type: type as InternalOpportunity["type"],
  manager: String(manager), applicants: Number(applicants), visibility: visibility as InternalOpportunity["visibility"], closes: String(closes), skills: skills as string[],
  mobilityPolicy: "Policy MOB-v3 · manager notification occurs only at the approved milestone",
}));

export const talentSummary = {
  prospects: prospects.length,
  contactable: prospects.filter((prospect) => prospect.consent === "Recruiting outreach").length,
  activeCampaigns: talentCampaigns.filter((campaign) => campaign.status === "Running" || campaign.status === "Scheduled").length,
  failedDistributions: jobDistributions.filter((distribution) => distribution.status === "Failed").length,
  internalOpportunities: internalOpportunities.length,
  internalApplicants: internalOpportunities.reduce((sum, opportunity) => sum + opportunity.applicants, 0),
};
