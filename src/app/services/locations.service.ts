import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LocationsResponse, Location } from '../models/location.model';

@Injectable({
  providedIn: 'root',
})
export class LocationsService {
  baseURL = 'https://rickandmortyapi.com/api';

  constructor(private http: HttpClient) {}

  fetchLocations(query?: string): Observable<LocationsResponse> {
    return this.http.get<LocationsResponse>(
      `${this.baseURL}/location/${query ? query : ''}`
    );
  }

  fetchLocation(id: string): Observable<Location> {
    return this.http.get<Location>(`${this.baseURL}/location/${id}`);
  }

  fetchMoreLocations(nextPageLink?: string): Observable<LocationsResponse> {
    return this.http.get<LocationsResponse>(`${nextPageLink}`);
  }
}
