
import { Policy } from "@/types";

export const mockPolicies: Policy[] = [
  {
    id: "1",
    title: "Healthcare Improvement Initiative",
    description: "A comprehensive policy to improve healthcare facilities across the city with a focus on expanding emergency services and modernizing equipment.",
    effectiveDate: "2025-05-01T00:00:00Z",
    officerId: "3",
    officerName: "Robert Officer",
    relatedDemandIds: ["4", "201"]
  },
  {
    id: "2",
    title: "City Infrastructure Development Plan",
    description: "A multi-year plan to upgrade city infrastructure including roads, public parks, and community facilities to improve citizen quality of life.",
    effectiveDate: "2025-06-15T00:00:00Z",
    officerId: "3",
    officerName: "Robert Officer",
    relatedDemandIds: ["1", "102"]
  },
  {
    id: "3",
    title: "Education System Enhancement Policy",
    description: "A policy focused on renovating schools, upgrading computer labs, and expanding digital resources in public educational institutions.",
    effectiveDate: "2025-07-01T00:00:00Z",
    officerId: "3",
    officerName: "Robert Officer",
    relatedDemandIds: ["3", "5"]
  }
];
