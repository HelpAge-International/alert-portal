import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNetworkPlanComponent } from './view-network-plan.component';

describe('ViewNetworkPlanComponent', () => {
  let component: ViewNetworkPlanComponent;
  let fixture: ComponentFixture<ViewNetworkPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewNetworkPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewNetworkPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
