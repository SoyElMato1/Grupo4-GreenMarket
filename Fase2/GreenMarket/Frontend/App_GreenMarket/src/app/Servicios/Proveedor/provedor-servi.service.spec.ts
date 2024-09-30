import { TestBed } from '@angular/core/testing';

import { ProvedorServiService } from './provedor-servi.service';

describe('ProvedorServiService', () => {
  let service: ProvedorServiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProvedorServiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
