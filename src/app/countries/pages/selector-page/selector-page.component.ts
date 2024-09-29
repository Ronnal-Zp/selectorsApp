import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/country.service';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit {

  public countriesByRegion: SmallCountry[] = [];

  public form: FormGroup = this.formBuilder.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    borders: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private countriesService: CountriesService
  ) {}

  ngOnInit(): void {
    this.onChangeRegion();
  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  onChangeRegion() {
    this.form.get('region')?.valueChanges
    .pipe(
      switchMap(region => this.countriesService.getCountriesByRegion(region)),
      tap( country => country.sort( (a,b) => a.name.localeCompare(b.name))),
    )
    .subscribe(countires => {
      this.countriesByRegion = countires;
    })
  }


}
