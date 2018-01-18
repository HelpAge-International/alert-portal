import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyAdevancedPreparednessComponent } from './local-agency-adevanced-preparedness.component';

describe('LocalAgencyAdevancedPreparednessComponent', () => {
  let component: LocalAgencyAdevancedPreparednessComponent;
  let fixture: ComponentFixture<LocalAgencyAdevancedPreparednessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyAdevancedPreparednessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyAdevancedPreparednessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
