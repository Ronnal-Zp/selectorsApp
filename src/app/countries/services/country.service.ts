import { Injectable } from '@angular/core';
import { Country, Region, SmallCountry } from '../interfaces/country.interface';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  private _baseUrl = 'https://restcountries.com/v3.1';

  private _regions: Region[] = [
    Region.Africa,
    Region.Americas,
    Region.Asia,
    Region.Europe,
    Region.Oceania
  ];

  constructor(
    private httpClient: HttpClient
  ) { }

  get regions(): Region[] {
    return [...this._regions];
  }

  getCountriesByRegion(region: Region): Observable<SmallCountry[]> {
    if(!region) return of([]);

    const url = `${this._baseUrl}/region/europe?fields=cca3,name,borders`;
    return this.httpClient.get<Country[]>(url)
      .pipe( // api devuelve el objeto country completo, se indica que campos quiero regresar
        map(countries => countries.map(country => ({
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders ?? []
        })))
      )
  }

}
