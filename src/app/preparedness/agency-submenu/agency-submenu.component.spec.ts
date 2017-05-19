import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencySubmenuComponent } from './agency-submenu.component';

describe('AgencySubmenuComponent', () => {
  let component: AgencySubmenuComponent;
  let fixture: ComponentFixture<AgencySubmenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencySubmenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencySubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
