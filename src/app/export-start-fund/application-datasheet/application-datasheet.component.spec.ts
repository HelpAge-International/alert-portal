import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDatasheet } from './application-datasheet.component';

describe('ApplicationDatasheet', () => {
  let component: ApplicationDatasheet;
  let fixture: ComponentFixture<ApplicationDatasheet>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationDatasheet ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationDatasheet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
