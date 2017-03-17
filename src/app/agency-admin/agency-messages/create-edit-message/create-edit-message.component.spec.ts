import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditMessageComponent } from './create-edit-message.component';

describe('CreateEditMessageComponent', () => {
  let component: CreateEditMessageComponent;
  let fixture: ComponentFixture<CreateEditMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
