import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyEditOfficeDetailsComponent } from './local-agency-edit-office-details.component';

describe('LocalAgencyEditOfficeDetailsComponent', () => {
  let component: LocalAgencyEditOfficeDetailsComponent;
  let fixture: ComponentFixture<LocalAgencyEditOfficeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyEditOfficeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyEditOfficeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
