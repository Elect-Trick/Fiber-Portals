import { HttpResponse } from '@capacitor/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/login.service';
import { UserRoles } from '../interfaces/user-roles';
import { Organizations } from '../interfaces/organizations';
import { UsersService } from '../services/users.service';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { PasswordValidator } from '../Validators/passwordValidator';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
})
export class AddUserPage implements OnInit, OnDestroy {
  public userRoles: UserRoles[] = [];
  roleSub!: Subscription;
  orgSub!: Subscription;
  registrationSub!: Subscription;
  organizations: Organizations[] = [];
  userDetails!: FormGroup;
  errors!: {};

  constructor(
    private loadingCtrl: LoadingController,
    private toast: ToastController,
    public loginService: LoginService,
    private usersService: UsersService
  ) {
    this.userDetails = new FormGroup(
      {
        account_name: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          PasswordValidator.passwordMatchingValidatior,
        ]),
        verify_password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        e_mail: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
        organization: new FormControl('', [Validators.required]),
        user_role: new FormControl('', [Validators.required]),
      },
      PasswordValidator.passwordMatchingValidatior
    );
  }

  ngOnInit() {
    this.roleSub = this.loginService.getAllUserRoles().subscribe((response) => {
      this.userRoles = response;
    });

    this.orgSub = this.loginService.getOrginzations().subscribe((response) => {
      this.organizations = response;
    });
  }

  async presentLoader() {
    const loader = await this.loadingCtrl.create({
      message: 'Adding user... Please wait',
    });
    return await loader.present();
  }

  async presentOutcomeToast(position: 'top', _message: string) {
    const toast = await this.toast.create({
      message: _message,
      duration: 2000,
      position: position,
    });
    return await toast.present();
  }

  register() {
    if (this.userDetails.valid) {
      this.presentLoader();
      this.registrationSub = this.usersService
        .registerUser(this.userDetails.value)
        .subscribe({
          next: (data) => {
            if (data) {
              this.userDetails.reset();
              this.loadingCtrl.dismiss();
              this.presentOutcomeToast('top', 'User added');
            } else {
              this.loadingCtrl.dismiss();
              this.presentOutcomeToast(
                'top',
                'Failed, please log back in or contact Dev'
              );
            }
          },
          error: (error: HttpResponse) => {
            this.loadingCtrl.dismiss();
            switch (error.status) {
              case 409:
                this.presentOutcomeToast('top', 'Email already exists');
                break;
              case 401:
                this.presentOutcomeToast(
                  'top',
                  'Unauthorized, please log back in'
                );
                break;
              case 209:
                this.presentOutcomeToast(
                  'top',
                  'No Content, Cannot supply empty content'
                );
                break;

              default:
                break;
            }
          },
        });
    }
  }

  ngOnDestroy(): void {
    if (this.roleSub) {
      this.roleSub.unsubscribe();
    }
    if (this.orgSub) {
      this.orgSub.unsubscribe();
    }
    if (this.registrationSub) {
      this.registrationSub.unsubscribe();
    }
  }

  fetchISPimage(orgnization: number) {
    return ISP[orgnization];
  }
}

enum ISP {
  'https://royalteas.co.za/resources/Afrihost.jpg' = 1,
  'https://royalteas.co.za/resources/Mweb.jpg' = 2,
}
