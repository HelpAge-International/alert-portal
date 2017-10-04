import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryCreateEditActionComponent } from './network-country-create-edit-actionn.component';

describe('NetworkCountryCreateEditActionComponent', () => {
  let component: NetworkCountryCreateEditActionComponent;
  let fixture: ComponentFixture<NetworkCountryCreateEditActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryCreateEditActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryCreateEditActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
