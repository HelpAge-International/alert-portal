import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {NetworkAccountSelectionComponent} from "./network-account-selection.component";

describe('NetworkAccountSelectionComponent', () => {
  let component: NetworkAccountSelectionComponent;
  let fixture: ComponentFixture<NetworkAccountSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkAccountSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkAccountSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
