import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkProfileProgrammeComponent } from './local-network-profile-programme.component';

describe('LocalNetworkProfileProgrammeComponent', () => {
  let component: LocalNetworkProfileProgrammeComponent;
  let fixture: ComponentFixture<LocalNetworkProfileProgrammeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkProfileProgrammeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkProfileProgrammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
