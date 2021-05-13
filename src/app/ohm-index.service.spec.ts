import { TestBed } from '@angular/core/testing';

import { OhmIndexService } from './ohm-index.service';

describe('OhmIndexService', () => {
  let service: OhmIndexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OhmIndexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
