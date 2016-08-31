import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'as-jobs',
  templateUrl: 'jobs.component.html',
  styleUrls: ['jobs.component.css']
})
export class JobsComponent implements OnInit {
    ngOnInit() {
        console.log('OnInit');
    }
}
