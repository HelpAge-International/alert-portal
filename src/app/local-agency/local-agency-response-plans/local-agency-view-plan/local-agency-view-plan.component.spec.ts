import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyViewPlanComponent } from './local-agency-view-plan.component';

describe('LocalAgencyViewPlanComponent', () => {
  let component: LocalAgencyViewPlanComponent;
  let fixture: ComponentFixture<LocalAgencyViewPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyViewPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyViewPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
