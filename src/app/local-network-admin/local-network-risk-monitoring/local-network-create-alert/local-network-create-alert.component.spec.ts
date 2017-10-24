import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkCreateAlertComponent } from './local-network-create-alert.component';

describe('LocalNetworkCreateAlertComponent', () => {
  let component: LocalNetworkCreateAlertComponent;
  let fixture: ComponentFixture<LocalNetworkCreateAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkCreateAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkCreateAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
