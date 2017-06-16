import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectNarrativeComponent } from './project-narrative.component';

describe('ProjectNarrativeComponent', () => {
  let component: ProjectNarrativeComponent;
  let fixture: ComponentFixture<ProjectNarrativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectNarrativeComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectNarrativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
