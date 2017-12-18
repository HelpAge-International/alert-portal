import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIndicatorLocalNetworkComponent } from './add-indicator-local-network.component';

describe('AddIndicatorLocalNetworkComponent', () => {
  let component: AddIndicatorLocalNetworkComponent;
  let fixture: ComponentFixture<AddIndicatorLocalNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddIndicatorLocalNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIndicatorLocalNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
