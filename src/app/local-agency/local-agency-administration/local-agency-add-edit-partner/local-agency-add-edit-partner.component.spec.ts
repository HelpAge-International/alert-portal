import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyAddEditPartnerComponent } from './local-agency-add-edit-partner.component';

describe('LocalAgencyAddEditPartnerComponent', () => {
  let component: LocalAgencyAddEditPartnerComponent;
  let fixture: ComponentFixture<LocalAgencyAddEditPartnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyAddEditPartnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyAddEditPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
