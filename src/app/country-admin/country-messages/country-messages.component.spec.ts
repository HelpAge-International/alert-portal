import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryMessagesComponent } from './country-messages.component';

describe('CountryMessagesComponent', () => {
  let component: CountryMessagesComponent;
  let fixture: ComponentFixture<CountryMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
