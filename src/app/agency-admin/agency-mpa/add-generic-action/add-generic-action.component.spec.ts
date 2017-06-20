import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {AddGenericActionComponent} from "./add-generic-action.component";

describe('AddGenericActionComponent', () => {
  let component: AddGenericActionComponent;
  let fixture: ComponentFixture<AddGenericActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGenericActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGenericActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
