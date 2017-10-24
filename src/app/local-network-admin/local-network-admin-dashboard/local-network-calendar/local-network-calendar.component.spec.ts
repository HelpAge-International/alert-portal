import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkCalendarComponent } from './local-network-calendar.component';

describe('LocalNetworkCalendarComponent', () => {
  let component: LocalNetworkCalendarComponent;
  let fixture: ComponentFixture<LocalNetworkCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
