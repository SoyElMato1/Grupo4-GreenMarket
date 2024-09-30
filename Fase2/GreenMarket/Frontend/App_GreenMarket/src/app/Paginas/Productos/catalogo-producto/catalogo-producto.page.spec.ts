import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogoProductoPage } from './catalogo-producto.page';

describe('CatalogoProductoPage', () => {
  let component: CatalogoProductoPage;
  let fixture: ComponentFixture<CatalogoProductoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoProductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
