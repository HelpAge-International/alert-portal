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

  genUniqueId(value: string) {
    return value.replace(/\./g, '_');
  }

  fadeIn() {
    jQuery("#info_bubble_" + this.genUniqueId(this.level1)).fadeIn();
  }

  toggleMore() {
    jQuery("#extend_span_" + this.genUniqueId(this.level1)).toggleClass('Active');
    jQuery("#extended_content_" + this.genUniqueId(this.level1)).slideToggle();
    jQuery("#info_bubble_" + this.genUniqueId(this.level1)).toggleClass('Active');
  }
}

