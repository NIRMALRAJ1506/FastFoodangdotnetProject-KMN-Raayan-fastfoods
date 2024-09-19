import { TestBed } from '@angular/core/testing';

import { ImgserviceService } from './imgservice.service';

describe('ImgserviceService', () => {
  let service: ImgserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImgserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
