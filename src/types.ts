/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CampaignStatus = "ACTIVE" | "DRAFT" | "COMPLETED" | "LIVE";

export interface Question {
  id: string;
  type: "NPS" | "CSAT" | "MultipleChoice";
  text: string;
  options: string[];
}

export interface Campaign {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  status: CampaignStatus;
  ratingType: "stars" | "numbers";
  targetAudience: string;
  tags: string[];
  questions: Question[];
  allowComments: boolean;
  submitButtonText: string;
  responsesCount: number;
  csatScore: number | null; // e.g. 4.8 or null if draft
  modifiedAt: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: "CSAT" | "Post-Purchase" | "Customer Support" | "Product Feedback";
  rating: number;
  timeToComplete: number; // in mins
  isPopular?: boolean;
  isDetailed?: boolean;
  isNew?: boolean;
  imageUrl: string;
  questions: Question[];
  tags: string[];
  submitButtonText: string;
}

export interface FeedbackComment {
  id: string;
  userName: string;
  avatarUrl?: string;
  rating: number;
  comment: string;
  date: string;
  tags: string[];
}

export interface DashboardMetrics {
  overallCsat: number;
  overallCsatDelta: string;
  totalResponses: string;
  totalResponsesCount: number;
  activeCampaignsCount: number;
}
