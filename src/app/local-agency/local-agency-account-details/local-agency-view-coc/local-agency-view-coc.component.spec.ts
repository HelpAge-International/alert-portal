import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyViewCocComponent } from './local-agency-view-coc.component';

describe('LocalAgencyViewCocComponent', () => {
  let component: LocalAgencyViewCocComponent;
  let fixture: ComponentFixture<LocalAgencyViewCocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyViewCocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyViewCocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
