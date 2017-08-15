import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkSettingsComponent } from './network-settings.component';

describe('NetworkSettingsComponent', () => {
  let component: NetworkSettingsComponent;
  let fixture: ComponentFixture<NetworkSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
