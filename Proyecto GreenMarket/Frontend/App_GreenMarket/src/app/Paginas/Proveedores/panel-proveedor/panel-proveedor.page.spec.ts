import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelProveedorPage } from './panel-proveedor.page';

describe('PanelProveedorPage', () => {
  let component: PanelProveedorPage;
  let fixture: ComponentFixture<PanelProveedorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelProveedorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
