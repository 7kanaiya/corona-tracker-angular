import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { IGlobalDataSummary } from '../models/data-list';
import { DateWiseData } from '../models/date-wise-data';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  private baseGlobalUrl =
    'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/';

  private dateWiseDataUrl =
    'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';

  private globalDataUrl = '';
  private extension = '.csv';
  month;
  year;
  date;

  getDateWiseData() {
    return this.http.get(this.dateWiseDataUrl, { responseType: 'text' }).pipe(
      map((result) => {
        let rows = result.split('\n');
        console.log(rows);
        let mainData = {};
        let header = rows[0];
        let dates = header.split(/,(?=\S)/);
        dates.splice(0, 4);
        rows.splice(0, 1);
        rows.forEach((row) => {
          let cols = row.split(/,(?=\S)/);
          let con = cols[1];
          cols.splice(0, 4);
          mainData[con] = [];
          cols.forEach((value, index) => {
            let dw: DateWiseData = {
              cases: +value,
              country: con,
              date: new Date(Date.parse(dates[index])),
            };
            mainData[con].push(dw);
          });
        });
      })
    );
  }

  makeItDouble(data: Number) {
    if (data < 10) {
      return '0' + data;
    }
    return data;
  }
  constructor(private http: HttpClient) {
    let now = new Date();
    this.month = now.getMonth() + 1;
    this.year = now.getFullYear();
    this.date = now.getDate();

    this.globalDataUrl = `${this.baseGlobalUrl}${this.makeItDouble(
      this.month
    )}-${this.makeItDouble(this.date)}-${this.year}${this.extension}`;
    //    console.log(this.globalDataUrl);
  }

  getGlobalData() {
    return this.http.get(this.globalDataUrl, { responseType: 'text' }).pipe(
      map((data) => {
        let model: IGlobalDataSummary[] = [];
        let raw = {};
        let rows = data.split('\n'); //splitting at new line
        rows.splice(0, 1);
        rows.forEach((item) => {
          let cols = item.split(/,(?=\S)/); //splitting when there space and comma
          let cs = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10],
          };
          let temp: IGlobalDataSummary = raw[cs.country]; //creating key of country
          if (temp) {
            temp.active = cs.active + temp.active; //statewise data adding into the one country key
            temp.confirmed = cs.confirmed + temp.confirmed;
            temp.deaths = cs.deaths + temp.deaths;
            temp.recovered = cs.recovered + temp.recovered;

            raw[cs.country] = temp;
          } else {
            raw[cs.country] = cs;
          }
        });

        return <IGlobalDataSummary>Object.values(raw);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status == 404) {
          if (this.date == 1) {
            this.date = 31;
            this.month--;
          }
          this.date = this.date - 1;

          this.globalDataUrl = `${this.baseGlobalUrl}${this.makeItDouble(
            this.month
          )}-${this.makeItDouble(this.date)}-${this.year}${this.extension}`;

          return this.getGlobalData();
        }
      })
    );
  }
}
