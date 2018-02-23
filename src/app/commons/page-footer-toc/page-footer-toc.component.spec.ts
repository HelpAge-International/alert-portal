import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageFooterTocComponent } from './page-footer-toc.component';

describe('PageFooterTocComponent', () => {
  let component: PageFooterTocComponent;
  let fixture: ComponentFixture<PageFooterTocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageFooterTocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageFooterTocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
