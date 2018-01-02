import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyAddEditCoordinationComponent } from './local-agency-add-edit-coordination.component';

describe('LocalAgencyAddEditCoordinationComponent', () => {
  let component: LocalAgencyAddEditCoordinationComponent;
  let fixture: ComponentFixture<LocalAgencyAddEditCoordinationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyAddEditCoordinationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyAddEditCoordinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
