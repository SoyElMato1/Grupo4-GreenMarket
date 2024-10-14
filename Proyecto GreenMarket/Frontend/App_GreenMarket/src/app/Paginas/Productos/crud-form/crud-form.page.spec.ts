import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudFormPage } from './crud-form.page';

describe('CrudFormPage', () => {
  let component: CrudFormPage;
  let fixture: ComponentFixture<CrudFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
