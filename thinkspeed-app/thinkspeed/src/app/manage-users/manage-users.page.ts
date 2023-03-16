import { OrdersService } from './../services/orders.service';
import { HttpResponse } from '@capacitor/core';
import { EditUserPage } from './../edit-user/edit-user.page';
import { Organizations } from './../interfaces/organizations';
import { User } from './../interfaces/user';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UsersService } from '../services/users.service';
import {
  ModalController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { ENUMS } from '../Helpers/globalEnums';
import { threadId } from 'worker_threads';

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
  totalEntries = 0;
  paginationArray: number[] = [];
  items_per_page = 2;
  activePage = 1;
  rowCount = 0;

  constructor(
    private userService: UsersService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}
  ngOnDestroy(): void {
    this.users = [];
    this.tempUsers = [];

    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }
  async presentLoader() {
    const loader = await this.loadingCtrl.create({
      message: 'Busy....',
    });
    return await loader.present();
  }

  ngOnInit() {
    this.countUsers(0);
    this.paginatedResults('root', 1).then(() => {
      this.activePage = 1;
    });
  }
  async fetchUsers() {
    this.userSub = this.userService.manageUsers().subscribe({
      next: (response) => {
        if (response) {
          this.users = response;
          this.tempUsers = response;
        } else {
          this.presentToast(
            'Your token has expired, please log back in',
            'top'
          );
          this.router.navigateByUrl('');
        }
      },
      error: (error: HttpResponse) => {
        switch (error.status) {
          case 400:
            this.presentToast('Something went wrong, Contact support', 'top');
            break;

          default:
            break;
        }
      },
    });
  }

  fetchRoleNames(roleID: number) {
    return ENUMS.GlobalEnums.fetchRoleName(roleID);
  }

  fetchOrganizationNames(orgID: number) {
    return ENUMS.GlobalEnums.fetchOrgNames(orgID);
  }
  presentPopover(event: Event, user: User) {
    this.selectedUser = user;
    this.popover.event = event;
    this.isOpen = true;
  }
  async presentToast(_message: string, _position: 'top') {
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
    }
  }

  async countUsers(multiplier: number) {
    this.userService.countUsers().subscribe({
      next: (response) => {
        this.totalEntries = response;
        this.rowCount = Math.ceil(this.totalEntries / this.items_per_page);
        // let display_row_count = Math.ceil(
        //   this.totalEntries  / this.items_per_page
        // );

        for (let index = 1; index <= this.rowCount; index++) {
          this.paginationArray.push(index);
        }
      },
    });
  }
  async paginatedResults(direction: string, page: number) {
    this.presentLoader().then(() => {
      switch (direction) {
        case 'root':
          this.activePage = page;
          this.userService.getPaginatedUsers(page).subscribe({
            next: (response) => {
              if (response) {
                console.log(response);
                this.users = response;
              }
            },
            complete: () => {
              setTimeout(() => {
                this.loadingCtrl.dismiss();
              }, 500);
            },
          });

          break;
      }
    });
  }

  deleteUser(selectedUser: User) {
    this.isOpen = false;
    this.selectedUser = selectedUser;
    if (this.selectedUser) {
      this.loginSub = this.userService
        .deleteUser(this.selectedUser.email)
        .subscribe((response) => {
          if (response) {
            this.presentToast('User successfully deleted', 'top');
            this.fetchUsers();
          } else {
            this.presentToast(
              'Failed to delete fUser, please log back in ',
              'top'
            );
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
