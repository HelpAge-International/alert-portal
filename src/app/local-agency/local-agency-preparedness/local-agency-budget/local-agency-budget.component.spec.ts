import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyBudgetComponent } from './local-agency-budget.component';

describe('LocalAgencyBudgetComponent', () => {
  let component: LocalAgencyBudgetComponent;
  let fixture: ComponentFixture<LocalAgencyBudgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyBudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
