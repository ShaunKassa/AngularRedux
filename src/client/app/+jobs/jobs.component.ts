import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'jobs',
  templateUrl: 'jobs.component.html',
  styleUrls: ['jobs.component.css'],
  directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES]
})
export class JobsComponent implements OnInit {
    ngOnInit() {
        console.log('OnInit');
    }
}
