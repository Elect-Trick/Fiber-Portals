import { LoadingController, ToastController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Outage } from '../interfaces/outage';
import { ManageFaultsService } from '../services/manage-faults.service';
import { Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-add-outage',
  templateUrl: './add-outage.page.html',
  styleUrls: ['./add-outage.page.scss'],
})
export class AddOutagePage implements OnInit {
  @ViewChild('placesRef') placesRef!: GooglePlaceDirective;
  area = '';
  @Output() newItemEvent = new EventEmitter<string>();

  affectedAreas : string[]=[];
  indcidentTypes = [{id:1, name:'Network Outage'},{id:2, name:'Maintance'}];
  severityLevel = [{id:1, name:'No Connectivity'},{id:2, name:'Intermiitent Connectivity'}];
  incident_form!: FormGroup;
  data! : Outage;
  constructor(private loadingCtrl: LoadingController, private toastCtrl: ToastController, private ticketService : ManageFaultsService) { }

  ngOnInit() {
    this.incident_form = new FormGroup({
      incident_type: new FormControl('', [
        Validators.required,

      ]), severity: new FormControl('', [
        Validators.required,

      ]),

    incident_report: new FormControl('', [
        Validators.required,

      ]), affected_areas: new FormControl('', [
        Validators.required,

      ]), date: new FormControl('', [
        Validators.required,

      ]),

    });
  }

  async presentLoader(){
    const loader = await this.loadingCtrl.create({
      message: 'Busy...',
    });
    return await loader.present();
  }
  nullChecker(event:any){

  }
  incidentChanged(event:any){
    console.log(event);

  }
  dateChanged(event: any){

    console.log(event.detail.value);
  }
  severityChanged(event : any){
    console.log(event.detail.value);
  }



  async presentAreaToast(){
    const toast = await this.toastCtrl.create({
      message:'Area Added',
      duration: 1000,
      position:'bottom'
    })
    return await toast.present();

  }
  async presentToast(
    _message: string,
    _data?: string,
    _duration?: number
  ) {
    const toast = await this.toastCtrl.create({
      message: _message,
      position: 'middle',
      duration: _duration,
      buttons: [
        {
          text: 'Copy and Close',
          role: 'ok',
          handler: () => {
            this.copy(_data);
          },
        },
      ],
    });
    return await toast.present();
  }

  copy(text?: any) {
    navigator.clipboard.writeText(text);
    this.toastCtrl.dismiss();
  }
  handleAddressChange(address:any){
    this.presentLoader().then(()=>{
      this.affectedAreas.push(address.name);
           this.loadingCtrl.dismiss();
      this.presentAreaToast();

    });



  }

  async logOutage(){
    this.presentLoader().then(()=>{
      this.incident_form.controls['affected_areas'].setValue(this.affectedAreas);
      this.data = this.incident_form.value;

      if(this.incident_form.valid){
        // submit to backend
        this.ticketService.logOutage(this.data).subscribe({next: (response : string)=>{
          if(response !=''){
            this.newItemEvent.emit(response);
            this.incident_form.reset();
            this.presentToast(`The Incident has been logged with Reference ${response}`,response);
            console.log(response);


          }else{

          }
        }});
      }
      this.loadingCtrl.dismiss();


    })



  }

}
