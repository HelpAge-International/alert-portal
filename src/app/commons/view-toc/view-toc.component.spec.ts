import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTocComponent } from './view-toc.component';

describe('ViewTocComponent', () => {
  let component: ViewTocComponent;
  let fixture: ComponentFixture<ViewTocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
