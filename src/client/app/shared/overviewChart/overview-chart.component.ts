import {
    Component,
    Input,
    ChangeDetectionStrategy,
    OnInit
} from '@angular/core';




@Component({
    selector: 'overview-chart',
    moduleId: module.id,
    templateUrl: './overview-chart.component.html',
    styleUrls: ['overview-chart.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class OverviewChartComponent implements OnInit {
    @Input() width1:any;
    @Input() width2:any;
    @Input() width3:any;
    @Input() slice2:any;
    @Input() slice3:any;
    @Input() slice4:any;
    @Input() percent:any;
    private slice2Value:any;
    private slice3Value:any;
    private slice4Value:any;

   ngOnInit() {
     if(this.slice2) {
            this.slice2Value = 20;
      } else {
            this.slice2Value = 0;
      }

     if(this.slice3) {
            this.slice3Value = 20;
      } else {
            this.slice3Value = 0;
      }

     if(this.slice4) {
            this.slice4Value = 20;
      } else {
            this.slice4Value = 0;
      }
   }
}
