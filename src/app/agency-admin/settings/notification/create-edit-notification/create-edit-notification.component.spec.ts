import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditNotificationComponent } from './create-edit-notification.component';

describe('CreateEditNotificationComponent', () => {
  let component: CreateEditNotificationComponent;
  let fixture: ComponentFixture<CreateEditNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
