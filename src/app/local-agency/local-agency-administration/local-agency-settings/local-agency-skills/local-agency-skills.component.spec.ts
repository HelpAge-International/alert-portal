import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencySkillsComponent } from './local-agency-skills.component';

describe('LocalAgencySkillsComponent', () => {
  let component: LocalAgencySkillsComponent;
  let fixture: ComponentFixture<LocalAgencySkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencySkillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencySkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
