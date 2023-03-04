import { LoginService } from 'src/login.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  timeoutId!: any;
  userInactive: Subject<any> = new Subject();
  public userRole = 0;
  public userRole2 = 0;
  public ispPages = [
    {
      title: 'Orders',
      url: '',
      icon: 'receipt',
      subMenu: [
        { title: 'Order Status', icon: 'timer', url: 'order-status' },
        { title: 'New Order', icon: 'location', url: 'place-order' },
      ],
    },
    {
      title: 'Services',
      url: '',
      icon: 'cog',
      subMenu: [
        { title: 'Find Service', icon: 'search', url: 'manage-service' },
      ],
    },
    {
      title: 'Support',
      url: '',
      icon: 'hammer',
      subMenu: [{ title: 'Tickets', icon: 'folder', url: 'tickets' }],
    },
    {
      title: 'Network Incidents',
      url: '',
      icon: 'alert-circle-outline',
      subMenu: [
        { title: 'View Incidents', icon: 'eye', url: 'isp-outage' },

      ],
    },
  ];
  public fnoPages = [
    {
      title: 'Billing',
      url: '',
      icon: 'cash-outline',
      subMenu: [
        { title: 'Invoices', icon: 'file-tray-full-outline', url: 'invoices' },
      ],
    },
    {
      title: 'Manage Orders',
      url: '',
      icon: 'receipt',
      subMenu: [{ title: 'View Orders', icon: 'timer', url: 'manage-orders' }],
    },
    {
      title: 'Manage Locations',
      url: '',
      icon: 'home-outline',
      subMenu: [
        { title: 'View Locations', icon: 'folder', url: 'locations' },
        {
          title: 'Add Location',
          icon: 'business-outline',
          url: 'add-location',
        },
      ],
    },
    {
      title: 'Tickets',
      url: '',
      icon: 'hammer',
      subMenu: [
        { title: 'Manage Tickets', icon: 'folder', url: 'manage-tickets' },
      ],
    },
    {
      title: 'Outages',
      url: '',
      icon: 'globe',
      subMenu: [
        { title: 'Manage Incidents', icon: 'construct-outline', url: 'manage-outages' },
        {
          title: 'View Incidents',
          icon: 'eye',
          url: 'outages',
        },
      ],
    },

    {
      title: 'Portal Users',
      url: 'home',
      icon: 'people',
      subMenu: [
        { title: 'Add User', icon: 'add-circle', url: 'add-user' },
        { title: 'Manage Users', icon: 'eye', url: 'manage-users' },
      ],
    },
    {
      title: 'Manage Services',
      url: '',
      icon: 'cog',
      subMenu: [
        { title: 'Find Service', icon: 'search', url: 'manage-service' },
      ],
    },

    {
      title: 'Network Incidents',
      url: '',
      icon: 'alert-circle-outline',
      subMenu: [
        { title: 'Open Issues', icon: 'lock-open-outline', url: 'home' },
        {
          title: 'Closed Incidents',
          icon: 'checkmark-done-circle-outline',
          url: 'home',
        },
      ],
    },
  ];

  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  isOpen = false;
  constructor(private router: Router, private loginService: LoginService) {
    this.checkTimeout();
  }
  ngOnInit(): void {
    this.loginService.loggedIn();
    let token = localStorage.getItem('token');
    if (token) {
      this.userRole = JSON.parse(atob(token.split('.')[1]));
    }
  }

  prepareMenu() {
    let token = localStorage.getItem('token');
    if (token) {
      let userItem = JSON.parse(atob(token.split('.')[1]));
      let role = userItem.user_role;

      switch (role) {
        case 1:
          break;

        default:
          break;
      }
    }
  }

  checkTimeout() {
    if (this.router.url.length == 1) {
      return;
    } else {
      this.timeoutId = setTimeout(() => {
        this.logout();
      }, 600000);
    }
  }
  @HostListener('window:keydown')
  @HostListener('window:mousedown')
  @HostListener('window:onhashchange')
  checkUserActivity() {
    clearTimeout(this.timeoutId);
    this.checkTimeout();
  }

  logout() {
    this.loginService.signOut();
    this.isOpen = false;
    this.router.navigateByUrl('/');
  }

  goHome() {
    this.router.navigateByUrl('/dashboard');
    this.isOpen = false;
  }
}
