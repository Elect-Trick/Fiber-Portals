import { HttpResponse } from '@capacitor/core';
import { EditUserPage } from './../edit-user/edit-user.page';
import { Organizations } from './../interfaces/organizations';
import { User } from './../interfaces/user';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UsersService } from '../services/users.service';
import { ModalController, ToastController } from '@ionic/angular';
import { stringify } from 'querystring';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.page.html',
  styleUrls: ['./manage-users.page.scss'],
})
export class ManageUsersPage implements OnInit, OnDestroy {
  userSub!: Subscription;
  loginSub!: Subscription;
  users: User[] = [];
  tempUsers: User[] = [];
  selectedUser!: User;
  @ViewChild('popover') popover: any;
  isOpen = false;
  searchString: string = '';

  constructor(
    private userService: UsersService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    this.users = [];
    this,this.tempUsers = [];


    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if(this.loginSub){
      this.loginSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.fetchUsers();
  }
  fetchUsers() {

    this.userSub = this.userService.manageUsers().subscribe({
      next: (response)=>{
        if(response){
          this.users = response;
          this.tempUsers = response;
        }
        else{
          this.presentToast('Your token has expired, please log back in','top');
          this.router.navigateByUrl('');

        }

      },error: (error:HttpResponse)=>{
        switch (error.status) {
          case 400:
            this.presentToast('Something went wrong, Contact support','top');
            break;

          default:
            break;
        }
      }
    });
  }

  fetchRoleNames(roleID: string) {
    return RoleNames[Number(roleID)];
  }

  fetchOrganizationNames(orgID: string) {
    return OrganizationName[Number(orgID)];
  }
  presentPopover(event: Event, user: User) {
    this.selectedUser = user;
    this.popover.event = event;
    this.isOpen = true;
  }
  async presentToast(_message: string, _position:'top') {
    const toast = await this.toastCtrl.create({
      message: _message,
      position: _position,
      duration: 2000,
    });
    return await toast.present();
  }
  async presentEditModal() {
    const modal = await this.modalCtrl.create({
      component: EditUserPage,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log('Modal Data is ' + data);
    }
  }

  deleteUser(selectedUser: User) {
    this.isOpen = false;
    this.selectedUser = selectedUser;
    console.log(this.selectedUser.userID);
    if (this.selectedUser) {
    this.loginSub =  this.userService
        .deleteUser(this.selectedUser.email)
        .subscribe((response) => {
          if (response) {
            this.presentToast('User successfully deleted','top');
            this.fetchUsers();
          } else {
            this.presentToast('Failed to delete User, please log back in ','top');
          }
        });
    }
  }
  search(event: any) {
    this.users = this.tempUsers;

    if (event.detail.value == '') {
      {
        this.users = this.tempUsers;
      }
    } else {
      this.users = this.users.filter((search) =>
        search.email.includes(event.detail.value)
      );
    }
  }
  clearSearch(event: any) {

    this.users = this.tempUsers;
  }
}
enum RoleNames {
  Super_User = 1,
  Admin = 2,
}

enum OrganizationName {
  Afrihost = 1,
  Mweb = 2,
}
