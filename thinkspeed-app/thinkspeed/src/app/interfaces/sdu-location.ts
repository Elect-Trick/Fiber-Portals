export interface SduLocation{
  house_number:number | string;
  street_name: string;
  surburb:string;
  postal_code:number;
  coordinates:string;
  network_id : string;
  is_Installed: boolean;
  creation_date:string;
  type:'sdu';
  isAdditional?:boolean;





}
