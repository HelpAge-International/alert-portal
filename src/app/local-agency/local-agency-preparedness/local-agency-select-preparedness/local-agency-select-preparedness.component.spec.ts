import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencySelectPreparednessComponent } from './local-agency-select-preparedness.component';

describe('LocalAgencySelectPreparednessComponent', () => {
  let component: LocalAgencySelectPreparednessComponent;
  let fixture: ComponentFixture<LocalAgencySelectPreparednessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencySelectPreparednessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencySelectPreparednessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
