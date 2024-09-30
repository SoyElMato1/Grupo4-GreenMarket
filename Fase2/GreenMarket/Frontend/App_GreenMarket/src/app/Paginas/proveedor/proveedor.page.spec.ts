import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProveedorPage } from './proveedor.page';

describe('ProveedorPage', () => {
  let component: ProveedorPage;
  let fixture: ComponentFixture<ProveedorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveedorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
