import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyProfileMenuComponent } from './local-agency-profile-menu.component';

describe('LocalAgencyProfileMenuComponent', () => {
  let component: LocalAgencyProfileMenuComponent;
  let fixture: ComponentFixture<LocalAgencyProfileMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyProfileMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyProfileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
