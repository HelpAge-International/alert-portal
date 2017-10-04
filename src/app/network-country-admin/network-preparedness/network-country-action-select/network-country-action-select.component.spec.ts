import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryActionSelectComponent } from './network-country-action-select.component';

describe('NetworkCountryActionSelectComponent', () => {
  let component: NetworkCountryActionSelectComponent;
  let fixture: ComponentFixture<NetworkCountryActionSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryActionSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryActionSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
