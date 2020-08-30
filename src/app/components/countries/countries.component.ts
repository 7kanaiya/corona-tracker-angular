import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { IGlobalDataSummary } from 'src/app/models/data-list';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css'],
})
export class CountriesComponent implements OnInit {
  data: IGlobalDataSummary[];
  countries: string[] = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  constructor(private dataService: DataServiceService) {}

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe((item) => {
      this.data = item;
      this.data.forEach((temp) => {
        this.countries.push(temp.country);
      });
    });
  }
  updateValues(country: string) {
    this.data.forEach((cs) => {
      if (country == cs.country) {
        this.totalConfirmed = cs.confirmed;
        this.totalActive = cs.active;
        this.totalDeaths = cs.deaths;
        this.totalRecovered = cs.recovered;
      }
    });
    console.log(country);
  }
}
