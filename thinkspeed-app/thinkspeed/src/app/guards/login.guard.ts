import { LoginService } from 'src/login.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(
    private loginService: LoginService,
    private toast: ToastController,
    private router: Router
  ) {}
  canActivate(): Observable<boolean> {
    return this.loginService.token$.pipe(
      map((response) => {
        if (!response) {
          this.presentToastMessage();
          this.router.navigateByUrl('');
          return false;

        } else {
          return true;
        }
      })
    );
  }
  async presentToastMessage() {
    const toast = await this.toast.create({
      message: 'You are not logged in... Redirecting',
      duration: 3000,
      position: 'top',
    });
    return await toast.present();
  }
}
