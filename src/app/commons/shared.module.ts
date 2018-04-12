import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {PageFooterTocComponent} from "./page-footer-toc/page-footer-toc.component";
import {PageFooterComponent} from "./page-footer/page-footer.component";
import {StatusAlertComponent} from "./status-alert/status-alert.component";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpLoaderFactory} from "../app.module";
import {Http} from "@angular/http";
import {AlertLoaderComponent} from "./alert-loader/alert-loader.component";
import {ReportProblemComponent} from "../report-problem/report-problem.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {TooltipComponent} from "../utils/tooltips/tooltip.component";
import {Angulartics2Module} from "angulartics2";

@NgModule({
  declarations: [
    PageFooterComponent,
    PageFooterTocComponent,
    StatusAlertComponent,
    AlertLoaderComponent,
    ReportProblemComponent,
    TooltipComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    Angulartics2Module.forChild()
  ],
  exports: [
    CommonModule,
    FormsModule,
    PageFooterComponent,
    PageFooterTocComponent,
    StatusAlertComponent,
    AlertLoaderComponent,
    ReportProblemComponent,
    NgbModule,
    TooltipComponent,
  ]

})
export class SharedModule {

}
