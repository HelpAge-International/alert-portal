import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCalendarComponent } from './network-calendar.component';

describe('NetworkCalendarComponent', () => {
  let component: NetworkCalendarComponent;
  let fixture: ComponentFixture<NetworkCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
