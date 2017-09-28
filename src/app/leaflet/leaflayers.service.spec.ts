import { TestBed, inject } from '@angular/core/testing';

import { LeaflayersService } from './leaflayers.service';

describe('LeaflayersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeaflayersService]
    });
  });

  it('should be created', inject([LeaflayersService], (service: LeaflayersService) => {
    expect(service).toBeTruthy();
  }));
});
