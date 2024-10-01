import { TestBed } from '@angular/core/testing';

import { CarritoServiService } from './carrito-servi.service';

describe('CarritoServiService', () => {
  let service: CarritoServiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarritoServiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
