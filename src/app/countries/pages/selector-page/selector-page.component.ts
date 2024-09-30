import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/country.service';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit {

  public countriesByRegion: SmallCountry[] = [];
  public countriesBorders:  SmallCountry[]  = [];

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
    this.onChangeCountry();
  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  onChangeRegion() {
    this.form.get('region')?.valueChanges
    .pipe(
      switchMap(region => this.countriesService.getCountriesByRegion(region)),
      tap( country => country.sort( (a,b) => a.name.localeCompare(b.name)))
    )
    .subscribe(countires => {
      if(countires.length == 0) this.clearAllForms();

      this.countriesByRegion = countires;
      this.form.get('country')?.setValue('');
    })
  }

  onChangeCountry() {
    this.form.get('country')?.valueChanges
    .pipe(
      filter((value: string) => value.length > 0),
      switchMap( (alpha) => this.countriesService.getCountryByAlphaCode(alpha)),
      switchMap( (country) => this.countriesService.getCountryBorderByCodes( country.borders ))
    )
    .subscribe(countries => {
      this.countriesBorders = countries;
      this.form.get('borders')?.setValue('');
    })
  }

  clearAllForms() {
    this.countriesByRegion = [];
    this.countriesBorders = [];
  }


}
