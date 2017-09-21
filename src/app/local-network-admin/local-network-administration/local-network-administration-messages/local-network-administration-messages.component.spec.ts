import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkAdministrationMessagesComponent } from './local-network-administration-messages.component';

describe('LocalNetworkAdministrationMessagesComponent', () => {
  let component: LocalNetworkAdministrationMessagesComponent;
  let fixture: ComponentFixture<LocalNetworkAdministrationMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkAdministrationMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkAdministrationMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
