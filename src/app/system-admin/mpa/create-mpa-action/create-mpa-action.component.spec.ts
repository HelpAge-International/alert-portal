import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMpaActionComponent } from './create-mpa-action.component';

describe('CreateMpaActionComponent', () => {
  let component: CreateMpaActionComponent;
  let fixture: ComponentFixture<CreateMpaActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMpaActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMpaActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
