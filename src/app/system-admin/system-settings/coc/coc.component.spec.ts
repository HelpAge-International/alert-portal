import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoCComponent } from './coc.component';

describe('CoCComponent', () => {
  let component: CoCComponent;
  let fixture: ComponentFixture<CoCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
