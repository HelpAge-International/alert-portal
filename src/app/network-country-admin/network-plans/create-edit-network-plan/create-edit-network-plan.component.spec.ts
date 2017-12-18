import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditNetworkPlanComponent } from './create-edit-network-plan.component';

describe('CreateEditNetworkPlanComponent', () => {
  let component: CreateEditNetworkPlanComponent;
  let fixture: ComponentFixture<CreateEditNetworkPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditNetworkPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditNetworkPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
