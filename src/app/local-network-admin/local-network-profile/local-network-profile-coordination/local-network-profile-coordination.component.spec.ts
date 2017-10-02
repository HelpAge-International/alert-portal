import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkProfileCoordinationComponent } from './local-network-profile-coordination.component';

describe('LocalNetworkProfileCoordinationComponent', () => {
  let component: LocalNetworkProfileCoordinationComponent;
  let fixture: ComponentFixture<LocalNetworkProfileCoordinationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkProfileCoordinationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkProfileCoordinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
