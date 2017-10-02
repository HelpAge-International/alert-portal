import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkProfileEquipmentComponent } from './local-network-profile-equipment.component';

describe('LocalNetworkProfileEquipmentComponent', () => {
  let component: LocalNetworkProfileEquipmentComponent;
  let fixture: ComponentFixture<LocalNetworkProfileEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkProfileEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkProfileEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
