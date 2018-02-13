import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyCoordinationComponent } from './local-agency-coordination.component';

describe('LocalAgencyCoordinationComponent', () => {
  let component: LocalAgencyCoordinationComponent;
  let fixture: ComponentFixture<LocalAgencyCoordinationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyCoordinationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyCoordinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
