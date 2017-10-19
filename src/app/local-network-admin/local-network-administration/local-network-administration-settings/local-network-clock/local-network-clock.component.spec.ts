import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkClockComponent } from './local-network-clock.component';

describe('LocalNetworkClockComponent', () => {
  let component: LocalNetworkClockComponent;
  let fixture: ComponentFixture<LocalNetworkClockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkClockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkClockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
