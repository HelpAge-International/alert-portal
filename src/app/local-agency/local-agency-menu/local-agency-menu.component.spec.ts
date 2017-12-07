import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyMenuComponent } from './local-agency-menu.component';

describe('LocalAgencyMenuComponent', () => {
  let component: LocalAgencyMenuComponent;
  let fixture: ComponentFixture<LocalAgencyMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
