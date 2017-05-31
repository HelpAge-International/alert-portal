import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewResponsePlanComponent } from './view-response-plan.component';

describe('ViewResponsePlanComponent', () => {
  let component: ViewResponsePlanComponent;
  let fixture: ComponentFixture<ViewResponsePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewResponsePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewResponsePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
