import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelAdministradorPage } from './panel-administrador.page';

describe('PanelAdministradorPage', () => {
  let component: PanelAdministradorPage;
  let fixture: ComponentFixture<PanelAdministradorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelAdministradorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
