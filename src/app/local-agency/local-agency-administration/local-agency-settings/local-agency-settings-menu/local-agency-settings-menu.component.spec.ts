import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencySettingsMenuComponent } from './local-agency-settings-menu.component';

describe('LocalAgencySettingsMenuComponent', () => {
  let component: LocalAgencySettingsMenuComponent;
  let fixture: ComponentFixture<LocalAgencySettingsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencySettingsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencySettingsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
