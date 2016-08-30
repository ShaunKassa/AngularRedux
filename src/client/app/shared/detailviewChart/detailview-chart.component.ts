import {
    Component,
    Input,
    ChangeDetectionStrategy,
    OnInit
} from '@angular/core';




@Component({
    selector: 'detailview-chart',
    moduleId: module.id,
    templateUrl: './detailview-chart.component.html',
    styleUrls: ['detailview-chart.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DetailviewChartComponent implements OnInit {
    @Input() detail_width1:any;
    @Input() detail_width2:any;
    @Input() detail_width3:any;
    @Input() slice2:any;
    @Input() slice3:any;
    @Input() slice4:any;
    @Input() percent:any;
    private slice2Value:any;
    private slice3Value:any;
    private slice4Value:any;

   ngOnInit() {
     if(this.slice2) {
            this.slice2Value = 50;
      } else {
            this.slice2Value = 0;
      }

     if(this.slice3) {
            this.slice3Value = 50;
      } else {
            this.slice3Value = 0;
      }

     if(this.slice4) {
            this.slice4Value = 50;
      } else {
            this.slice4Value = 0;
      }
   }
}
