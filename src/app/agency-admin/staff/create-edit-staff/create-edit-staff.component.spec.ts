import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {CreateEditStaffComponent} from "./create-edit-staff.component";

describe('CreateEditStaffComponent', () => {
  let component: CreateEditStaffComponent;
  let fixture: ComponentFixture<CreateEditStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
