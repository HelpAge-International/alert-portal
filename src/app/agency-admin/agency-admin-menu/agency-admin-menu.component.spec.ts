import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {AgencyAdminMenuComponent} from "./agency-admin-menu.component";

describe('AgencyAdminMenuComponent', () => {
  let component: AgencyAdminMenuComponent;
  let fixture: ComponentFixture<AgencyAdminMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyAdminMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyAdminMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
