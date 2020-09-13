import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { IGlobalDataSummary } from '../../models/data-list';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  datatable = [];
  globalData: IGlobalDataSummary[];
  loader = true;
  chart = {
    PieChart: 'PieChart',
    ColumnChart: 'ColumnChart',
    height: 500,
    options: {
      animation: {
        duration: 1000,
        easing: 'out',
      },
      is3D: true,
    },
  };

  constructor(private dataService: DataServiceService) {}
  initChart(theType: string) {
    // this.datatable.push(['Country', 'Cases']);
    this.datatable = [];
    this.globalData.forEach((cs) => {
      if (theType == 'd') this.datatable.push([cs.country, cs.deaths]);
      if (theType == 'c') this.datatable.push([cs.country, cs.confirmed]);

      if (theType == 'a') this.datatable.push([cs.country, cs.active]);
      if (theType == 'r') this.datatable.push([cs.country, cs.recovered]);
    });
  }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe((data) => {
      this.globalData = data;
      data.forEach((item) => {
        if (!Number.isNaN(item.confirmed)) {
          this.totalActive += item.active;
          this.totalConfirmed += item.confirmed;
          this.totalDeaths += item.deaths;
          this.totalRecovered += item.recovered;
        }
      });
      this.initChart('c');
    });
    setTimeout(() => {
      this.loader = false;
    }, 1000);
  }
  updateChart(input: HTMLInputElement) {
    this.initChart(input.value);
  }
}
