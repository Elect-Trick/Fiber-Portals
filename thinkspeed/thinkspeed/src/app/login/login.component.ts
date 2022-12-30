import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../styles.scss']
})
export class LoginComponent implements OnInit {

  // title = 'thinkspeed | Admin';
  loginGroup: FormGroup;
  loggedIn  = false;

  constructor(private loginService : LoginService){

    this.loginGroup = new FormGroup({
      password : new FormControl('',[Validators.required, Validators.minLength(5)]),
      email :new FormControl('',[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])

    })


  }



   login(form: any){

     this.loginService.login().subscribe(data =>{
      console.log(data);
     });

    // console.log(this.password?.errors);

    // console.log(this.loginGroup.controls['password'].errors?.['required']);
    // console.log(this.loginGroup.controls['password'].errors?.['minLength']);

    if(this.loginGroup.valid){
      this.loggedIn = true;
      console.log('Form Valid')
    }
    else{
      console.log('Form NOT Valid')

      alert('Wrong track');
    }


  }


  ngOnInit(): void {
  }

}
