import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryMessagesComponent } from './network-country-messages.component';

describe('NetworkCountryMessagesComponent', () => {
  let component: NetworkCountryMessagesComponent;
  let fixture: ComponentFixture<NetworkCountryMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
