import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyProfileComponent } from './local-agency-profile.component';

describe('LocalAgencyProfileComponent', () => {
  let component: LocalAgencyProfileComponent;
  let fixture: ComponentFixture<LocalAgencyProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
