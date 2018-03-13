import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyViewTocComponent } from './local-agency-view-toc.component';

describe('LocalAgencyViewTocComponent', () => {
  let component: LocalAgencyViewTocComponent;
  let fixture: ComponentFixture<LocalAgencyViewTocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyViewTocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyViewTocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
