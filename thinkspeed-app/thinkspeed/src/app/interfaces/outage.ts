import { IonDatetime } from "@ionic/angular";

export interface Outage {
  outage_id: number;
  outage_reference: string;
  incident_type:number;
  severity:number;
  date:Date;
  outage_status:number;
  incident_report:string;
  affected_areas: string[];
  last_updated:Date;
  description:string;
}
