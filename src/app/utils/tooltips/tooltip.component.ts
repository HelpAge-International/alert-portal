import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Md5} from "ts-md5/dist/md5";
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
  private randomNumber = Math.floor(Math.random() * 100000) + 1;

  ngOnInit() {

  }

  ngOnDestroy() {
  }

  genUniqueId(value: string): string {
    return Md5.hashStr(value) + this.randomNumber.toString();
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

