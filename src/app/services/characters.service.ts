import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CharactersResponse } from '../models/character.model';

@Injectable({
  providedIn: 'root',
})
export class CharactersService {
  baseURL = 'https://rickandmortyapi.com/api';

  constructor(private http: HttpClient) {}

  fetchCharacters(query?: string): Observable<CharactersResponse> {
    return this.http.get<CharactersResponse>(
      `${this.baseURL}/character/${query ? query : ''}`
    );
  }

  fetchMoreCharacters(nextPageLink?: string): Observable<CharactersResponse> {
    return this.http.get<CharactersResponse>(`${nextPageLink}`);
  }
}
