import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryApaComponent } from './network-country-apa.component';

describe('NetworkCountryApaComponent', () => {
  let component: NetworkCountryApaComponent;
  let fixture: ComponentFixture<NetworkCountryApaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryApaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryApaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
