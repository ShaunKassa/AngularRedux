import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgSwitch, NgSwitchCase } from '@angular/common';

import { Ng2SliderComponent } from '../../shared/slider/ng2-slider.component'; 
import { FilterServiceModel } from '../../shared/models/filter-service.model'; 
import { CoverageCsvGenerationModel } from '../../shared/models/coverage-csv-generation.model'; 
import { DepthGenerationModel } from '../../shared/models/depth-generation.model'; 
import { PostIngestModel} from '../../shared/models/post-ingest.model'; 
import { PreIngestModel} from '../../shared/models/pre-ingest.model'; 


export class FormValues {
    jobType: string;
}

@Component({
  moduleId: module.id,
  selector: 'jobs-create',
  templateUrl: 'jobs-create.component.html',
  styleUrls: ['jobs-create.component.css'],
  directives: [ NgSwitch, NgSwitchCase, Ng2SliderComponent ],
})

export class JobsCreateComponent {

     depthGenerationForm:FormGroup;
     coverageCsvForm:FormGroup;
     postIngestForm:FormGroup;
     preIngestForm:FormGroup;
     filterServiceForm:FormGroup;

     constructor(private fromBuilder:FormBuilder) { }

     ngOnInit() {
               this.depthGenerationForm = this.formBuilder.group({
                      city: '',
                      publicationDate:'',
 				      validationType:'',
                      submissionType:'',
				      inputType:'',
                      input:''
               });


               this.coverageCsvForm= this.formBuilder.group({
                      city: '',
                      publicationDate:'',
					  environment:'',
				      inputType:'',
                      input:''
               });

               this.postIngestForm = this.formBuilder.group({
                      publicationDate:'',
					  environment:'',
                      input:''
               });

               this.preIngestForm = this.formBuilder.group({
                      city: '',
                      publicationDate:'',
					  environment:'',
				      inputType:'',
                      input:''
               });

               this.filterServiceForm = this.formBuilder.group({
                       attributeTypes:'',
                       provider:'',
                       filterList:'',
                       preset:'',
                       instanceLabel:'',
                       publicationDate:'',
                       areaOfInterest:'',
                       input:'',
                       driveStartDate:'',
                       driveEndDate:'',
                       weight:'',
                       qualityFilterLow:'',
                       qualityFilterMedium:'',
                       qualityFilterHigh:'',
                       qualityTreshold:'',
                       saveAsPreset:'',
                       presetLable:''
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

    SelectJob(job, $event) {
        for(var name in this.createForm.controls) {
           (<FormControl>this.createForm.controls[name]).updateValue('');
           this.createForm.controls[name].setErrors(null);
         }
         this.formValues.jobType = job;
         this.jobTYPE = job;
         $('li.items').removeClass('highlight');
         $($event.target).addClass('highlight');
    }

    addFilter(add:Boolean) {
        this.filterList.push(
            {
             filterInputLow : '33',
             filterInputMedium : '33',
             filterInputHigh : '33'
            }
        );
    }

    deleteFilter(idx:number) {
        this.filterList.splice(idx, 1);
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
