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
  public appPages = [
    {
      title: 'Users',
      url: 'home',
      icon: 'people',
      subMenu: [
        { title: 'Add User', icon: 'add-circle', url: 'add-user' },
        { title: 'Manage Users', icon: 'eye', url: 'manage-users' },
      ],
    },
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
        { title: 'Find Service', icon: 'search', url: 'home' },
        { title: 'Regrade', icon: 'swap-vertical', url: 'home' },
      ],
    },
    {
      title: 'Support',
      url: '',
      icon: 'hammer',
      subMenu: [
        { title: 'Log Ticket', icon: 'ticket', url: 'home' },
        { title: 'Tickets', icon: 'folder', url: 'home' },
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
    this.router.navigateByUrl('/');
  }
}
