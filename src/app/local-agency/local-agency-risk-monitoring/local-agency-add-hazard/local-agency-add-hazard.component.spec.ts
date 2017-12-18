import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyAddHazardComponent } from './local-agency-add-hazard.component';

describe('LocalAgencyAddHazardComponent', () => {
  let component: LocalAgencyAddHazardComponent;
  let fixture: ComponentFixture<LocalAgencyAddHazardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyAddHazardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyAddHazardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
