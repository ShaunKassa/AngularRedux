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
                      city: ['',Validators.compose([Validators.required])],
                      publicationDate:['',Validators.compose([Validators.required])],
 	    		      validationType:['',Validators.compose([Validators.required])],
                      submissionType:['',Validators.compose([Validators.required])],
	    		      inputType:['',Validators.compose([Validators.required])],
                      input:['',Validators.compose([Validators.required,
                                                    this.emptyLineValidator,
                                                    this.whitespaceValidator,
                                                    this.driveIdValidator])]
               });


               this.coverageCsvForm= this.formBuilder.group({
                      city: ['',Validators.compose([Validators.required])],
                      publicationDate:['',Validators.compose([Validators.required])],
	    			  environment:['',Validators.compose([Validators.required])],
	    		      inputType:['',Validators.compose([Validators.required])],
                      input:['',Validators.compose([Validators.required,
                                                    this.emptyLineValidator,
                                                    this.whitespaceValidator,
                                                    this.mosquadIdValidator])]
               });

               this.postIngestForm = this.formBuilder.group({
                      publicationDate:['',Validators.compose([Validators.required])],
	    			  environment:['',Validators.compose([Validators.required])],
                      input:['',Validators.compose([Validators.required
                                                    this.emptyLineValidator,
                                                    this.whitespaceValidator,
                                                    this.postIngestValidator])]
               });

               this.preIngestForm = this.formBuilder.group({
                      city: ['',Validators.compose([Validators.required])],
                      publicationDate:['',Validators.compose([Validators.required])],
	    			  environment:['',Validators.compose([Validators.required])],
	    		      inputType:['',Validators.compose([Validators.required])],
                      input:['',Validators.compose([Validators.required
                                                    this.emptyLineValidator,
                                                    this.whitespaceValidator,
                                                    this.mosquadIdValidator])]
               });

               this.filterServiceForm = this.formBuilder.group({
                       attributeTypes:['',Validators.compose([Validators.required])],
                       provider:['',Validators.compose([Validators.required])],
                       filterList:['',Validators.compose([Validators.required])],
                       preset:['',Validators.compose([Validators.required])],
                       instanceLabel:['',Validators.compose([Validators.required])],
                       publicationDate:['',Validators.compose([Validators.required])],
                       areaOfInterest:['',Validators.compose([Validators.required])],
                       input:['',Validators.compose([Validators.required])],
                       driveStartDate:['',Validators.compose([Validators.required])],
                       driveEndDate:['',Validators.compose([Validators.required])],
                       weight:['',Validators.compose([Validators.required])],
                       qualityFilterLow:['',Validators.compose([Validators.required])],
                       qualityFilterMedium:['',Validators.compose([Validators.required])],
                       qualityFilterHigh:['',Validators.compose([Validators.required])],
                       qualityTreshold:['',Validators.compose([Validators.required])],
                       saveAsPreset:['',Validators.compose([Validators.required])],
                       presetLable:['',Validators.compose([Validators.required])]
               });
     }

      SelectJob(jobType, $event) {
           this.selectedJobType = jobType;
           $('li.items').removeClass('highlight');
           $($event.target).addClass('highlight');
      }

      private emptyLineValidator(control: FormControl):{[s: string] } {
               if(control.value.match(/\n\s*\n/) ) {
                   return {emptyLine: true};
               }
      }

      private whitespaceValidator(control: FormControl):{[s: string] } {
               if(control.value.match(/^ +/m) || control.value.match(/[ \t]+$/m) ) {
                   return {whitespace: true};
               }
      }

      private driveIdValidator(control: FormControl):{[s: string] } {
               if(!control.value.match(/^(HT[\w\d]+_(\d)+,?.*\s*)*$/)) {
                   return {driveId: true};
               }
      }

      private mosquadIdValidator(control: FormControl):{[s: string] } {
               if(!control.value.match(/^([0-3]{14}\s*)*$/)) {
                   return {mosquadId: true};
               }
      }

      private postIngestValidator(control: FormControl):{[s: string] } {
               if(control.value.match(/^[A-Za-z\s,]*"([0-3]{14}\s*)*"$/)) {
                   return {postIngest: true};
               }
      }

  }
