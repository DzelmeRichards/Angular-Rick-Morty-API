import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CharactersService } from '../../services/characters.service';
import { Character, CharactersResponse } from 'src/app/models/character.model';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss'],
})
export class CharactersComponent implements OnInit, OnDestroy {
  characters: Character[] | undefined;
  charactersSubscription: Subscription | undefined;
  nextPageLink: string | undefined;
  locationId: string | undefined;

  charactersSearchForm: FormGroup = this.fb.group({});

  constructor(
    private route: ActivatedRoute,
    private charactersService: CharactersService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.charactersSubscription = this.charactersService
      .fetchCharacters()
      .subscribe((response: CharactersResponse) => {
        this.characters = response.results;
        this.nextPageLink = response.info.next;
      });
    this.buildForm();
  }

  buildForm(): void {
    this.charactersSearchForm = this.fb.group({
      nameQuery: [''],
      genderQuery: [''],
    });
  }

  filterbyQueries(): void {
    let query = '';
    const nameQuery = this.charactersSearchForm.get('nameQuery');
    const genderQuery = this.charactersSearchForm.get('genderQuery');

    if (nameQuery?.value && genderQuery?.value) {
      query = `?name=${nameQuery?.value}&gender=${genderQuery?.value}`;
    } else if (nameQuery?.value) {
      query = `?name=${nameQuery?.value}&gender=`;
    } else {
      query = `?name=&gender=${genderQuery?.value}`;
    }
    this.charactersSubscription = this.charactersService
      .fetchCharacters(query)
      .subscribe((response: CharactersResponse) => {
        this.characters = response.results;
        this.nextPageLink = response.info.next;
      });
  }

  getMoreCharacters(): void {
    this.charactersSubscription = this.charactersService
      .fetchMoreCharacters(this.nextPageLink)
      .subscribe((response: CharactersResponse) => {
        if (this.characters) {
          this.characters = [...this.characters, ...response.results];
          this.nextPageLink = response.info.next;
        }
      });
  }

  ngOnDestroy(): void {
    this.charactersSubscription?.unsubscribe();
  }
}
