import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyModulesComponent } from './local-agency-modules.component';

describe('LocalAgencyModulesComponent', () => {
  let component: LocalAgencyModulesComponent;
  let fixture: ComponentFixture<LocalAgencyModulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyModulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
