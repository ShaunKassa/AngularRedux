import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'jobs-overview',
  templateUrl: 'jobs-overview.component.html',
  styleUrls: ['jobs-overview.component.css']
})
export class JobsOverviewComponent implements OnInit {
    ngOnInit() {
        console.log('OnInit');
    }
}
