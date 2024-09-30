import { TestBed } from '@angular/core/testing';

import { ProductoServiService } from './producto-servi.service';

describe('ProductoServiService', () => {
  let service: ProductoServiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductoServiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
