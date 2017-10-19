import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCreateAlertComponent } from './network-create-alert.component';

describe('NetworkCreateAlertComponent', () => {
  let component: NetworkCreateAlertComponent;
  let fixture: ComponentFixture<NetworkCreateAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCreateAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCreateAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
