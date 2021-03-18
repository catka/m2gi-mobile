import { TestBed } from '@angular/core/testing';

import { AccountInfoAutocompleteService } from './account-info-autocomplete.service';

describe('AccountInfoAutocompleteService', () => {
  let service: AccountInfoAutocompleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountInfoAutocompleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
