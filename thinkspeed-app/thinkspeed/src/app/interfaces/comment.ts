export interface Comment {
  comment_id: number;
  ticket_id: number;
  service_id: number;
  replier_email: string;
  comment: string;
  location_id: number;
  location_type: string;
  reply_date: string;
}
