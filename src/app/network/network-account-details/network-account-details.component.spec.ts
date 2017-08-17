import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkAccountDetailsComponent } from './network-account-details.component';

describe('NetworkAccountDetailsComponent', () => {
  let component: NetworkAccountDetailsComponent;
  let fixture: ComponentFixture<NetworkAccountDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkAccountDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
