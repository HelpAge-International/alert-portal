import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorAccountSettingsViewCocComponent } from './director-account-settings-view-coc.component';

describe('DirectorAccountSettingsViewCocComponent', () => {
  let component: DirectorAccountSettingsViewCocComponent;
  let fixture: ComponentFixture<DirectorAccountSettingsViewCocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectorAccountSettingsViewCocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectorAccountSettingsViewCocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
