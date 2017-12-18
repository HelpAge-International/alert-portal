import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkPlanComponent } from './local-network-plan.component';

describe('LocalNetworkPlanComponent', () => {
  let component: LocalNetworkPlanComponent;
  let fixture: ComponentFixture<LocalNetworkPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
