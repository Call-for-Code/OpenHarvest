import { TestBed } from '@angular/core/testing';

import { LandAreasService } from './land-areas.service';

describe('LandAreasService', () => {
  let service: LandAreasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandAreasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
