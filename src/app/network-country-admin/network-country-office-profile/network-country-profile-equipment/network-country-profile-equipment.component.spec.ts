import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryProfileEquipmentComponent } from './network-country-profile-equipment.component';

describe('NetworkCountryProfileEquipmentComponent', () => {
  let component: NetworkCountryProfileEquipmentComponent;
  let fixture: ComponentFixture<NetworkCountryProfileEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryProfileEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryProfileEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
