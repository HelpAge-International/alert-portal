import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyMinimumPreparednessComponent } from './local-agency-minimum-preparedness.component';

describe('LocalAgencyMinimumPreparednessComponent', () => {
  let component: LocalAgencyMinimumPreparednessComponent;
  let fixture: ComponentFixture<LocalAgencyMinimumPreparednessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyMinimumPreparednessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyMinimumPreparednessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
