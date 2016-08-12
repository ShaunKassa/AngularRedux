import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'jobs-detailview',
  templateUrl: 'jobs-detailview.component.html',
  styleUrls: ['jobs-detailview.component.css']
})
export class JobsDetailviewComponent implements OnInit {
    ngOnInit() {
        console.log('OnInit');
    }
}
