import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyAddIndicatorComponent } from './local-agency-add-indicator.component';

describe('LocalAgencyAddIndicatorComponent', () => {
  let component: LocalAgencyAddIndicatorComponent;
  let fixture: ComponentFixture<LocalAgencyAddIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyAddIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyAddIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
