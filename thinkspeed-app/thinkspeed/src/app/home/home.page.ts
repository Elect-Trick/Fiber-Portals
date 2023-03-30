import { User } from './../interfaces/user';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpError, JsonHubProtocol } from '@microsoft/signalr';
import { LoginService } from 'src/login.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpResponse } from '@capacitor/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss', '../../global.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  loginGroup: FormGroup;
  loggedIn = false;
  loginSub!: Subscription;
  user: User = {
    user_id: 0,
    account_name: '',
    organization: 0,
    role: 0,
    token: '',
    email: '',
  };

  constructor(
    private toast: ToastController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private loginService: LoginService
  ) {

    this.loginGroup = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
    });
  }
  ngOnDestroy(): void {
    this.user = {
      user_id: 0,
      account_name: '',
      organization: 0,
      role: 0,
      token: '',
      email: '',
    };
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }
  async presentLoader(_message: string) {
    const loader = await this.loadingCtrl.create({
      message: _message,
    });
    return await loader.present();
  }

  async presentToast(_message: string) {
    const toast = await this.toast.create({
      message: _message,
      position: 'top',
      duration: 2000,
    });
    return await toast.present();
  }

  async login() {
    await this.presentLoader('Logging in... Please wait');
    if (this.loginGroup.valid) {
      this.loginSub = this.loginService.login(this.loginGroup.value).subscribe({
        next: (data) => {
          if (data) {
            this.loadingCtrl.dismiss();
            this.loginService.setToken(data);
            this.loginService.loggedIn();
            this.router.navigateByUrl('/dashboard');
          } else {
            this.presentToast('User does not exist, Create an account');
            this.loadingCtrl.dismiss();
          }
        },
        error: (error: HttpResponse) => {
          switch (error.status) {
            case 401:
              this.presentToast('Credentials are invalid, Try again');
              // this.loadingCtrl.dismiss();

              break;
            case 0:
              this.presentToast('Please contact support, Server may be down');
              // this.loadingCtrl.dismiss();

              break;
            case 400:
              this.presentToast('Please contact support, Server may be down');
              // this.loadingCtrl.dismiss();
              break;

            default:
              break;
          }
          this.loadingCtrl.dismiss();
        },
      });
    }
  }

  setCurrentUser() {}

  ngOnInit(): void {}
}
