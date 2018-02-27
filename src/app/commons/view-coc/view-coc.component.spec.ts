import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCocComponent } from './view-coc.component';

describe('ViewCocComponent', () => {
  let component: ViewCocComponent;
  let fixture: ComponentFixture<ViewCocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
