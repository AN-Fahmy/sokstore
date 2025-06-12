import { TestBed } from '@angular/core/testing';

import { SalesoperationService } from './salesoperation.service';

describe('SalesoperationService', () => {
  let service: SalesoperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesoperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
