import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyComponent } from './local-agency.component';

describe('LocalAgencyComponent', () => {
  let component: LocalAgencyComponent;
  let fixture: ComponentFixture<LocalAgencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
