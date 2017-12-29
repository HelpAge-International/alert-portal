import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyAddPartnerOrganisationComponent } from './local-agency-add-partner-organisation.component';

describe('LocalAgencyAddPartnerOrganisationComponent', () => {
  let component: LocalAgencyAddPartnerOrganisationComponent;
  let fixture: ComponentFixture<LocalAgencyAddPartnerOrganisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyAddPartnerOrganisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyAddPartnerOrganisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
