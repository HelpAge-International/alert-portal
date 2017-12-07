import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyHeaderComponent } from './local-agency-header.component';

describe('LocalAgencyHeaderComponent', () => {
  let component: LocalAgencyHeaderComponent;
  let fixture: ComponentFixture<LocalAgencyHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
