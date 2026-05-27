export type DocumentType = 'CC' | 'CE' | 'NIT';
export type Status = 'ACTIVE' | 'INACTIVE';

export interface Affiliate {
  id: number;
  full_name: string;
  document_type: DocumentType;
  document_number: string;
  email: string;
  status: Status;
  created_at: string;
  updated_at: string;
}

export interface AffiliateListResponse {
  total_count: number;
  page: number;
  page_size: number;
  results: Affiliate[];
}

export interface AffiliateSummary {
  affiliate_id: number;
  total_contributed: number;
  contribution_count: number;
  last_contribution_date?: string | null;
}
