import { LoadingController } from '@ionic/angular';
import { LoginService } from 'src/login.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { Stats } from '../interfaces/stats';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit, OnDestroy {
  public folder!: string;
  public barChartLegend = true;
  public barChartPlugins = [];
  activeService = 0;
  stats: Stats = {
    active_services: 0,
    pending_services: 0,
    cancelled_services: 0,
    rejected_orders: 0,
    closed_tickets: 0,
    open_tickets: 0,
    pending_orders: 0,
  };

  public barChartData!: ChartConfiguration<'bar'>['data'];
  finalUrl = 'http://localhost:8060/';

  async fetchStats() {
    await this.presentLoader().then(() => {
      this.loginService.fetchStats().subscribe({
        next: (response) => {
          if (response) {
            this.stats = response;
            this.prepareChart();
          }
        },
      });
      this.loadingCtrl.dismiss();
    });
  }

  async presentLoader() {
    const loading = await this.loadingCtrl.create({
      message: 'Busy...',
    });

    return await loading.present();
  }
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    backgroundColor: [
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)',
    ] as any,
  };
  sourceUrl!: SafeUrl;

  constructor(
    private loginService: LoginService,
    private loadingCtrl: LoadingController
  ) {
    this.fetchStats();

  }
  ngOnDestroy(): void {}

  ngOnInit() {}
  prepareChart() {
    this.barChartData = {
      labels: [
        ['Active Services'],
        ['Pending Activations'],
        'Cancelled Services',
        'Rejected Orders',
        'Pending Orders',
        'Open Tickets',
        'Closed Tickets',
      ],
      datasets: [
        {
          data: [
            this.stats.active_services,
            this.stats.pending_services,
            this.stats.cancelled_services,
            this.stats.rejected_orders,
            this.stats.pending_orders,
            this.stats.open_tickets,
            this.stats.closed_tickets,
          ],
          label: '',
        },
      ],
    };
  }
}
