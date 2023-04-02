export interface Ticket {
  ticket_id: number;
  ticket_reference: string;
  ticket_status: number;
  location_id: number;
  location_type: string;
  service_id: number;
  fault_id: number;
  fault_description: string;
  comments: string;
  client_name: string;
  client_surname: string;
  client_contact_number: string;
  client_email: string;
  creation_date: string;
  network_id: string;
  alternative_contact_name: string;
  alternative_number: string;
  last_updated: string;
  organization_id:number;
  technician:number;
}
