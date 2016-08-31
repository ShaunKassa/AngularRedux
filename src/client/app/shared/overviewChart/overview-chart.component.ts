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
    // Public Members
    @Input() slices: Array<number>;

    percent: string;
    widths: Array<number> = [];
    circumference: number = 251.3;
    strokeWidth: number = 20;

    ngOnInit() {
       this.generateArcWidths();
    }

    private generateArcWidths() {
        this.widths[0] = (this.slices[0]) * this.circumference / 100;
        this.widths[1] = ((this.slices[0] + this.slices[1])) * this.circumference / 100;
        this.widths[2] = ((this.slices[0] + this.slices[1] + this.slices[2])) * this.circumference / 100;
        let finishedPortion= this.slices[2] + this.slices[3];
        if(finishedPortion >= 100) {
            this.percent = 'done';
        } else {
            this.percent = (Math.round((this.slices[2] + this.slices[3]) * 100) / 100).toFixed(1);
        }
    }
}
