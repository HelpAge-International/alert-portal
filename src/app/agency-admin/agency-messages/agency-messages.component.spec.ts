import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {AgencyMessagesComponent} from "./agency-messages.component";

describe('AgencyMessagesComponent', () => {
  let component: AgencyMessagesComponent;
  let fixture: ComponentFixture<AgencyMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
