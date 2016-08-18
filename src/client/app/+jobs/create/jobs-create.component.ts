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



     onSubmit(value): void {
         let address: string = '';
         let fileName: string = '';
         let text: string = '';
         let date: string = '';
         if(this.jobTYPE === 'Depth Generation') {
             value.jobTypes = this.jobTYPE;
             address = (
                     'home/selvaraj/depthAutomation/jobs/DepthGenerationForCity/input/validatePanoCount/').concat(value.submissionType)
                 ;
             date = (value.pubDate).replace('/','_');
             fileName = '/'+(value.city.toUpperCase())+'_'+ date + '_drives.txt';
             address = address + fileName;
             text = value.driveInput;
             this.formValues.jobType = 'Default';
             $('li.items').removeClass('highlight');
         }

         if(this.jobTYPE === 'Coverage CSV Generation') {
             value.jobTypes = this.jobTYPE;
             address = ('home/selvaraj/depthAutomation/jobs/CoverageCSVGeneration/input/').concat(value.env);
             date = (value.pubDate).replace('/','_');
             fileName = '/'+(value.city.toUpperCase())+'_'+ date + '_mosquad.csv';
             address = address + fileName;
             text = value.mosquadInput;
             this.formValues.jobType = 'Default';
             $('li.items').removeClass('highlight');
         }

         if(this.jobTYPE=== 'PostIngest Depth Statistics') {
             value.jobTypes = this.jobTYPE;
             address = ('home/selvaraj/depthAutomation/jobs/PostIngestDepthStatistics/input/').concat(value.env);
             date = (value.pubDate).replace('/','_');
             fileName = '/'+ date + '_mosquad.txt';
             address = address + fileName;
             text = value.postIngestInput;
             this.formValues.jobType = 'Default';
             $('li.items').removeClass('highlight');
         }

         if(this.jobTYPE === 'PreIngest') {
             value.jobTypes = this.jobTYPE;
             address = 'home/selvaraj/depthAutomation/jobs/PreIngest/input/';
             date = (value.pubDate).replace('/','_');
             fileName = (value.city.toUpperCase())+'_' + date + '_mosquads.txt';
             address = address + fileName;
             text = value.mosquadInput;
             this.formValues.jobType = 'Default';
             $('li.items').removeClass('highlight');
         }

         var bucket = new AWS.S3({params: {Bucket: 'aethicupload'}});
         var params = {Key: address, Body: text};
         bucket.upload(params, function (err) {
             if(err) {
                 console.log(err);
             } else {
                 console.log('Success');
             }
         });

         return;
     }

      SelectJob(jobType, $event) {
           this.selectedJobType = jobType;
           $('li.items').removeClass('highlight');
           $($event.target).addClass('highlight');
      }
  }
