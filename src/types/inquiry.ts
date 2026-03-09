export type InquiryStatus =
  | "new"
  | "replied"
  | "negotiating"
  | "scheduled_pickup"
  | "ghosted"
  | "converted"
  | "closed_lost";

export type Inquiry = {
  id: string;
  item_id: string | null;
  platform: string | null;
  buyer_name: string | null;
  buyer_email: string | null;
  buyer_phone: string | null;
  message_summary: string | null;
  offered_price: number | null;
  inquiry_status: InquiryStatus | string;
  follow_up_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateInquiryInput = {
  item_id?: string | null;
  platform?: string | null;
  buyer_name?: string | null;
  buyer_email?: string | null;
  buyer_phone?: string | null;
  message_summary?: string | null;
  offered_price?: number | null;
  inquiry_status?: InquiryStatus | string;
  follow_up_date?: string | null;
  notes?: string | null;
};

export type UpdateInquiryInput = Partial<CreateInquiryInput>;

export type InquiryListFilters = {
  query?: string;
  platform?: string | "all";
  status?: InquiryStatus | "all";
  item_id?: string | null;
};

export type InquiryMetric = {
  label: string;
  value: string | number;
  helper?: string;
};