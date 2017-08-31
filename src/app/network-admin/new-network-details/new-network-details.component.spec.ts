import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {NewNetworkDetailsComponent} from "./new-network-details.component";

describe('NewNetworkDetailsComponent', () => {
  let component: NewNetworkDetailsComponent;
  let fixture: ComponentFixture<NewNetworkDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewNetworkDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewNetworkDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
