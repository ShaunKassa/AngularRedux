import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgSwitch, NgSwitchCase } from '@angular/common';

import { Ng2SliderComponent } from '../../shared/slider/ng2-slider.component'; 

@Component({
  moduleId: module.id,
  selector: 'jobs-create',
  templateUrl: 'jobs-create.component.html',
  styleUrls: ['jobs-create.component.css']
})

export class JobsCreateComponent implements OnInit {

    depthGenerationForm:FormGroup;
    coverageCsvForm:FormGroup;
    postIngestForm:FormGroup;
    preIngestForm:FormGroup;
    filterServiceForm:FormGroup;
    jobTypesList = [
        'Depth Generation',
        'Coverage CSV Generation',
        'PostIngest Depth Statistics',
        'PreIngest',
        'CSV generation'
    ];
    selectedJobType = 'Default';

     constructor(private formBuilder:FormBuilder) { }
     

     ngOnInit() {
               
               this.depthGenerationForm = this.formBuilder.group({
                      city: ['',Validators.required],
                      publicationDate:['',Validators.required],
 	    		      validationType:['',Validators.required],
                      submissionType:['',Validators.required],
	    		      inputType:['',Validators.required],
                      input:['',Validators.required]
               });


               this.coverageCsvForm= this.formBuilder.group({
                      city: ['',Validators.required],
                      publicationDate:['',Validators.required],
	    			  environment:['',Validators.required],
	    		      inputType:['',Validators.required],
                      input:['',Validators.required]
               });

               this.postIngestForm = this.formBuilder.group({
                      publicationDate:['',Validators.required],
	    			  environment:['',Validators.required],
                      input:['',Validators.required]
               });

               this.preIngestForm = this.formBuilder.group({
                      city: ['',Validators.required],
                      publicationDate:['',Validators.required],
	    			  environment:['',Validators.required],
	    		      inputType:['',Validators.required],
                      input:['',Validators.required]
               });

               this.filterServiceForm = this.formBuilder.group({
                       attributeTypes:['',Validators.required],
                       provider:['',Validators.required],
                       filterList:['',Validators.required],
                       preset:['',Validators.required],
                       instanceLabel:['',Validators.required],
                       publicationDate:['',Validators.required],
                       areaOfInterest:['',Validators.required],
                       input:['',Validators.required],
                       driveStartDate:['',Validators.required],
                       driveEndDate:['',Validators.required],
                       weight:['',Validators.required],
                       qualityFilterLow:['',Validators.required],
                       qualityFilterMedium:['',Validators.required],
                       qualityFilterHigh:['',Validators.required],
                       qualityTreshold:['',Validators.required],
                       saveAsPreset:['',Validators.required],
                       presetLable:['',Validators.required]
               });
     }

      SelectJob(jobType, $event) {
           this.selectedJobType = jobType;
           $('li.items').removeClass('highlight');
           $($event.target).addClass('highlight');
      }
  }
