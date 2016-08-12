import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'jobs-create',
  templateUrl: 'jobs-create.component.html',
  styleUrls: ['jobs-create.component.css']
})
export class JobsCreateComponent implements OnInit {
    ngOnInit() {
        console.log('OnInit');
    }
}
