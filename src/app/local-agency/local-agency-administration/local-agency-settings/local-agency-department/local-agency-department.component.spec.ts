import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyDepartmentComponent } from './local-agency-department.component';

describe('LocalAgencyDepartmentComponent', () => {
  let component: LocalAgencyDepartmentComponent;
  let fixture: ComponentFixture<LocalAgencyDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
