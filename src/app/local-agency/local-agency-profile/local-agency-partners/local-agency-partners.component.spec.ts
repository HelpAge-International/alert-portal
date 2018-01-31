import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyPartnersComponent } from './local-agency-partners.component';

describe('LocalAgencyPartnersComponent', () => {
  let component: LocalAgencyPartnersComponent;
  let fixture: ComponentFixture<LocalAgencyPartnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyPartnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
