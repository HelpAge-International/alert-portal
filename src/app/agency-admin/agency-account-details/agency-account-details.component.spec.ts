import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyAccountDetailsComponent } from './agency-account-details.component';

describe('AgencyAccountDetailsComponent', () => {
  let component: AgencyAccountDetailsComponent;
  let fixture: ComponentFixture<AgencyAccountDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyAccountDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
