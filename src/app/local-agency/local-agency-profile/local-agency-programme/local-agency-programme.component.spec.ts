import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyProgrammeComponent } from './local-agency-programme.component';

describe('LocalAgencyProgrammeComponent', () => {
  let component: LocalAgencyProgrammeComponent;
  let fixture: ComponentFixture<LocalAgencyProgrammeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyProgrammeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyProgrammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
