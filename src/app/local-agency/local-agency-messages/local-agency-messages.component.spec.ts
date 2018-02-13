import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyMessagesComponent } from './local-agency-messages.component';

describe('LocalAgencyMessagesComponent', () => {
  let component: LocalAgencyMessagesComponent;
  let fixture: ComponentFixture<LocalAgencyMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
