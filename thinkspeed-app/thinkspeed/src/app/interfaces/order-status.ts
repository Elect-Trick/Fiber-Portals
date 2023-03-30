import { IonDatetime } from "@ionic/angular";

export interface OrderStatus {
  order_type: number;
  order_number: string;
  order_status: number;
  product: number;
  creation_date: number;
  location_id: number;
  client_name: string;
  client_surname: string;
  client_email: string;
  contact_number: string;
  isp_reference: string;
  organization_id: number;
  network_id: string;
  location_type: string;
  technician_id?:number;
  order_fullfilled?:number;
  scheduled_date?:IonDatetime;

}
