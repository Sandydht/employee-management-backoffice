import { Component, input, OnChanges } from '@angular/core';
import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexLegend,
  ApexDataLabels,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { Employee } from '../../../employee/models/employee.model';

@Component({
  selector: 'app-employee-status-chart',
  imports: [NgApexchartsModule],
  templateUrl: './employee-status-chart.html',
  styleUrl: './employee-status-chart.css',
})
export class EmployeeStatusChartComponent implements OnChanges {
  employees = input<Employee[]>([]);

  series: ApexNonAxisChartSeries = [];
  labels: string[] = [];
  colors: string[] = ['#4ADE80', '#F87171'];

  chart: ApexChart = {
    type: 'donut',
    height: 320,
  };

  legend: ApexLegend = {
    position: 'bottom',
  };

  dataLabels: ApexDataLabels = {
    enabled: true,
  };

  responsive: ApexResponsive[] = [
    {
      breakpoint: 768,
      options: {
        chart: {
          height: 250,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ];

  ngOnChanges(): void {
    this.loadChart();
  }

  private loadChart() {
    if (!this.employees().length) return;

    const activeCount = this.employees().filter((e) => e.status === 'ACTIVE').length;

    const inactiveCount = this.employees().filter((e) => e.status === 'INACTIVE').length;

    this.series = [activeCount, inactiveCount];
    this.labels = ['Active', 'Inactive'];
  }
}
