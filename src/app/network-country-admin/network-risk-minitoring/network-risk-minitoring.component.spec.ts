import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkRiskMinitoringComponent } from './network-risk-minitoring.component';

describe('NetworkRiskMinitoringComponent', () => {
  let component: NetworkRiskMinitoringComponent;
  let fixture: ComponentFixture<NetworkRiskMinitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkRiskMinitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkRiskMinitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
