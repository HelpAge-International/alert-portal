import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPartnerOrganisationComponent } from './add-partner-organisation.component';

describe('AddPartnerOrganisationComponent', () => {
  let component: AddPartnerOrganisationComponent;
  let fixture: ComponentFixture<AddPartnerOrganisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPartnerOrganisationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPartnerOrganisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
