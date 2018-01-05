import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyNotificationComponent } from './local-agency-notification.component';

describe('LocalAgencyNotificationComponent', () => {
  let component: LocalAgencyNotificationComponent;
  let fixture: ComponentFixture<LocalAgencyNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
