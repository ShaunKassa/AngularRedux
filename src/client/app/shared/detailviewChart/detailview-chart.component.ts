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
    // Public Members
    @Input() slices: Array<number>;

    percent: string;
    widths: Array<number> = [];
    circumference: number = 596.9;
    strokeWidth: number = 50;

    ngOnInit() {
       this.generateArcWidths();
    }

    private generateArcWidths() {
        this.widths[0] = (this.slices[0]) * this.circumference / 100;
        this.widths[1] = ((this.slices[0] + this.slices[1])) * this.circumference / 100;
        this.widths[2] = ((this.slices[0] + this.slices[1] + this.slices[2])) * this.circumference / 100;
        let finishedPortion = this.slices[2] + this.slices[3];
        if(finishedPortion >= 100) {
            this.percent = 'done';
        } else {
            this.percent = (Math.round((this.slices[2] + this.slices[3]) * 100) / 100).toFixed(1);
        }
    }
}
