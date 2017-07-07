import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {AgencyNotificationsComponent} from "./agency-notifications.component";

describe('AgencyNotificationsComponent', () => {
  let component: AgencyNotificationsComponent;
  let fixture: ComponentFixture<AgencyNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
