import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {CreateEditMpaComponent} from "./create-edit-mpa.component";

describe('CreateEditMpaComponent', () => {
  let component: CreateEditMpaComponent;
  let fixture: ComponentFixture<CreateEditMpaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditMpaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditMpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
