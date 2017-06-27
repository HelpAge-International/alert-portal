import {Component, Input, OnDestroy, OnInit} from "@angular/core";
/**
 * Created by jordan on 21/06/2017.
 */
declare var jQuery: any;

@Component({
  selector: 'tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css']
})

export class TooltipComponent implements OnInit, OnDestroy {

  @Input() public level1: string;
  @Input() public level2: string;
  @Input() public linkUrl: string;

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  fadeIn() {
    jQuery(".Info__bubble").fadeIn();
  }

  toggleMore() {
    jQuery(".Extend__span").toggleClass('Active');
    jQuery(".Extended__content").slideToggle();
    jQuery(".Info__bubble").toggleClass('Active');
  }
}

