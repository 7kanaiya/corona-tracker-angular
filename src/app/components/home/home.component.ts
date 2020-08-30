import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { IGlobalDataSummary } from '../../models/data-list';
import { GoogleChartInterface } from 'ng2-google-charts';
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
  globalData: IGlobalDataSummary[];
  pieChart: GoogleChartInterface = {
    chartType: 'PieChart',
  };
  columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart',
  };
  constructor(private dataService: DataServiceService) {}
  initChart(theType: string) {
    let datatable = [];
    datatable.push(['Country', 'Cases']);

    this.globalData.forEach((cs) => {
      if (theType == 'd') datatable.push([cs.country, cs.deaths]);
      if (theType == 'c') datatable.push([cs.country, cs.confirmed]);

      if (theType == 'a') datatable.push([cs.country, cs.active]);
      if (theType == 'r') datatable.push([cs.country, cs.recovered]);
    });

    this.pieChart = {
      chartType: 'PieChart',
      dataTable: datatable,
      options: {
        height: 500,
      },
    };
    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: datatable,
      options: {
        height: 500,
      },
    };
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
      this.initChart('r');
    });
  }
  updateChart(input: HTMLInputElement) {
    this.initChart(input.value);
  }
}
