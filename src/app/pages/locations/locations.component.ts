import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocationsService } from '../../services/locations.service';
import { Location, LocationsResponse } from 'src/app/models/location.model';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent implements OnInit, OnDestroy {
  locations: Location[] | undefined;
  locationsSubscription: Subscription | undefined;
  nextPageLink: string | undefined;

  locationsSearchForm: FormGroup = this.fb.group({});

  constructor(
    private route: ActivatedRoute,
    private locationsService: LocationsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.locationsSubscription = this.locationsService
      .fetchLocations()
      .subscribe((response: LocationsResponse) => {
        this.locations = response.results;
        this.nextPageLink = response.info.next;
      });
  }

  buildForm(): void {
    this.locationsSearchForm = this.fb.group({
      nameQuery: [''],
      dimensionQuery: [''],
    });
  }

  filterbyQueries(): void {
    let query = '';
    const nameQuery = this.locationsSearchForm.get('nameQuery');
    const dimensionQuery = this.locationsSearchForm.get('dimensionQuery');

    if (nameQuery?.value !== '' && dimensionQuery?.value !== '') {
      query = `?name=${nameQuery?.value}&dimension=${dimensionQuery?.value}`;
    } else if (nameQuery?.value !== '') {
      query = `?name=${nameQuery?.value}`;
    } else {
      query = `?dimension=${dimensionQuery?.value}`;
    }
    this.locationsSubscription = this.locationsService
      .fetchLocations(query)
      .subscribe((response: LocationsResponse) => {
        this.locations = response.results;
        this.nextPageLink = response.info.next;
      });
  }

  getMoreLocations(): void {
    this.locationsSubscription = this.locationsService
      .fetchMoreLocations(this.nextPageLink)
      .subscribe((response: LocationsResponse) => {
        if (this.locations) {
          this.locations = [...this.locations, ...response.results];
          this.nextPageLink = response.info.next;
        }
      });
  }

  ngOnDestroy(): void {
    this.locationsSubscription?.unsubscribe();
  }
}
