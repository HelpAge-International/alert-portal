import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkAdministrationAgenciesComponent } from './local-network-administration-agencies.component';

describe('LocalNetworkAdministrationAgenciesComponent', () => {
  let component: LocalNetworkAdministrationAgenciesComponent;
  let fixture: ComponentFixture<LocalNetworkAdministrationAgenciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkAdministrationAgenciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkAdministrationAgenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
