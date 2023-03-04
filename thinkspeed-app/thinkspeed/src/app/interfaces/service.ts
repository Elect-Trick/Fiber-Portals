export interface Service {
  service_id: number;
  location_id: number;
  product_id: number;
  organization_id: number;
  isp_order_number: string;
  network_id: string;
  isp_modem_mac: string;
  service_status: number;
  last_updated: string;
  order_type: number;
  valn: string;
  location_string: string;
  client_name: string;
  client_surname: string;
  client_contact_number: string;
  client_email: string;
  order_number: string;
}
