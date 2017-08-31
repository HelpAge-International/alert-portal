import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkPlanSettingsComponent } from './network-plan-settings.component';

describe('NetworkPlanSettingsComponent', () => {
  let component: NetworkPlanSettingsComponent;
  let fixture: ComponentFixture<NetworkPlanSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkPlanSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkPlanSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
