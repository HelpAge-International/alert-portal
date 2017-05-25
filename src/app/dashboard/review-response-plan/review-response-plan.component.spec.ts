import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewResponsePlanComponent } from './review-response-plan.component';

describe('ReviewResponsePlanComponent', () => {
  let component: ReviewResponsePlanComponent;
  let fixture: ComponentFixture<ReviewResponsePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewResponsePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewResponsePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
