/** Modèles partagés entre le site public et le backoffice. */

export type ProcessingStatus = 'Pending' | 'Processing' | 'Ready' | 'Failed';
export type MediaKind = 'Video' | 'Image';
export type PublishStatus = 'Draft' | 'Published';
export type LeadStatus = 'New' | 'Handled' | 'Won' | 'Lost';

/** Rendu transcodé d'une vidéo (une entrée par format servi). */
export interface Rendition {
  /** `video/mp4` ou `video/webm`. */
  type: string;
  url: string;
  width: number;
  height: number;
  /** Rendu sans piste audio, utilisé pour les fonds de bande. */
  muted: boolean;
}

export interface MediaAsset {
  id: string;
  kind: MediaKind;
  fileName: string;
  posterUrl: string | null;
  width: number;
  height: number;
  durationSec: number;
  sizeBytes: number;
  processingStatus: ProcessingStatus;
  renditions: Rendition[];
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  sortOrder: number;
  filmCount: number;
  isPublished: boolean;
  reel: MediaAsset | null;
  poster: MediaAsset | null;
}

export interface Film {
  id: string;
  categoryId: string;
  categorySlug: string;
  title: string;
  client: string;
  date: string | null;
  duration: string;
  description: string;
  sortOrder: number;
  isFeatured: boolean;
  status: PublishStatus;
  media: MediaAsset | null;
  poster: MediaAsset | null;
}

export interface ServiceCard {
  id: string;
  name: string;
  included: string[];
  duration: string;
  deliverables: string;
  startingPrice: string;
  sortOrder: number;
}

export interface ProcessStep {
  id: string;
  index: string;
  title: string;
  body: string;
  sortOrder: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  sortOrder: number;
}

export interface ClientLogo {
  id: string;
  name: string;
  imageUrl: string | null;
  sortOrder: number;
}

export interface AboutBlock {
  portraitUrl: string | null;
  paragraphs: string[];
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  email: string;
  instagram: string;
  city: string;
  region: string;
  legalText: string;
  showreel: MediaAsset | null;
}

/** Charge utile unique de `GET /api/public/site`. */
export interface SitePayload {
  settings: SiteSettings;
  services: ServiceCard[];
  process: ProcessStep[];
  about: AboutBlock;
  testimonials: Testimonial[];
  logos: ClientLogo[];
}

export interface LeadRequest {
  name: string;
  email: string;
  projectType: string;
  eventDate: string | null;
  budgetRange: string;
  message: string;
  /** Champ pot de miel : doit rester vide. */
  website: string;
}

export interface Lead extends Omit<LeadRequest, 'website'> {
  id: string;
  status: LeadStatus;
  createdAt: string;
  userAgent: string;
}

export interface AuditLogEntry {
  id: string;
  userEmail: string;
  entity: string;
  entityId: string;
  action: string;
  diff: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAtUtc: string;
  email: string;
  role: 'Admin' | 'Editor';
}

export interface ReorderRequest {
  ids: string[];
}
