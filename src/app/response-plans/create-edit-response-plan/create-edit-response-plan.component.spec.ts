import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditResponsePlanComponent } from './create-edit-response-plan.component';

describe('CreateEditResponsePlanComponent', () => {
  let component: CreateEditResponsePlanComponent;
  let fixture: ComponentFixture<CreateEditResponsePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditResponsePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditResponsePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
