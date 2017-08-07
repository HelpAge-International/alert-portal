import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorAccountSettingsComponent } from './director-account-settings.component';

describe('DirectorAccountSettingsComponent', () => {
  let component: DirectorAccountSettingsComponent;
  let fixture: ComponentFixture<DirectorAccountSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectorAccountSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectorAccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
