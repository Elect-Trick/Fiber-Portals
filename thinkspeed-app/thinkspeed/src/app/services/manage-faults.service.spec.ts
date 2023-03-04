import { TestBed } from '@angular/core/testing';

import { ManageFaultsService } from './manage-faults.service';

describe('ManageFaultsService', () => {
  let service: ManageFaultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageFaultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
