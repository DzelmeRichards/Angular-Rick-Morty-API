import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { LocationsService } from '../../services/locations.service';
import { Location } from 'src/app/models/location.model';

@Component({
  selector: 'app-single-location',
  templateUrl: './single-location.component.html',
  styleUrls: ['./single-location.component.scss'],
})
export class SingleLocationComponent implements OnInit, OnDestroy {
  locationsSubscription: Subscription | undefined;

  location$: Observable<Location> | undefined;

  constructor(
    private route: ActivatedRoute,
    private locationsService: LocationsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      this.location$ = this.locationsService.fetchLocation(id);
    });
  }

  ngOnDestroy(): void {
    this.locationsSubscription?.unsubscribe();
  }
}
