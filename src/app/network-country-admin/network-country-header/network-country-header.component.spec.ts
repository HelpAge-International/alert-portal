import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryHeaderComponent } from './network-country-header.component';

describe('NetworkCountryHeaderComponent', () => {
  let component: NetworkCountryHeaderComponent;
  let fixture: ComponentFixture<NetworkCountryHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
