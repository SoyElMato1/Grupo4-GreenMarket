import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialCompraPage } from './historial-compra.page';

describe('HistorialCompraPage', () => {
  let component: HistorialCompraPage;
  let fixture: ComponentFixture<HistorialCompraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialCompraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
