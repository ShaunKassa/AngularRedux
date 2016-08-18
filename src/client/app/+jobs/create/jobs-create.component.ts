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

    attributeTypes = ['ORIENT','XYALIGN','ZJUMP','INTERVAL','DRIFT',
                      'LOWERED','ACCURACY','LENSOB','UNDEREXP','OVEREXP',
                      'FOGGING','CARMASK','SEAMLINE','SINGLE_CAM_EXP','ALIGNMENT',
                      'DROPPACK','SENSORCAL','LIDARFAIL','SKYNOISE'
    ];
    
    filterList: Object[] = [
        {
            filterInputLow : '33',
            filterInputMedium : '33',
            filterInputHigh : '33'
        }
    ];

    _filterIndices: Array<Number> = [0];
    _filterCurrentIndex: Number = 0;


    selectedJobType = 'Default';

     constructor(private formBuilder:FormBuilder) { }
     

     ngOnInit() {
               
               this.depthGenerationForm = this.formBuilder.group({
                      city: ['',Validators.compose([Validators.required])],
                      publicationDate:['',Validators.compose([Validators.required])],
 	    		      validationType:['validatePanoCount',Validators.compose([Validators.required])],
                      submissionType:['',Validators.compose([Validators.required])],
	    		      inputType:['drive',Validators.compose([Validators.required])],
                      input:['',Validators.compose([Validators.required,
                                                    this.emptyLineValidator,
                                                    this.whitespaceValidator,
                                                    this.driveIdValidator])]
               });


               this.coverageCsvForm= this.formBuilder.group({
                      city: ['',Validators.compose([Validators.required])],
                      publicationDate:['',Validators.compose([Validators.required])],
	    			  environment:['',Validators.compose([Validators.required])],
	    		      inputType:['mosquads',Validators.compose([Validators.required])],
                      input:['',Validators.compose([Validators.required,
                                                    this.emptyLineValidator,
                                                    this.whitespaceValidator,
                                                    this.mosquadIdValidator])]
               });

               this.postIngestForm = this.formBuilder.group({
                      publicationDate:['',Validators.compose([Validators.required])],
	    			  environment:['',Validators.compose([Validators.required])],
                      input:['',Validators.compose([Validators.required,
                                                    this.emptyLineValidator,
                                                    this.whitespaceValidator,
                                                    this.postIngestValidator])]
               });

               this.preIngestForm = this.formBuilder.group({
                      city: ['',Validators.compose([Validators.required])],
                      publicationDate:['',Validators.compose([Validators.required])],
	    			  environment:['dev',Validators.compose([Validators.required])],
	    		      inputType:['mosquads',Validators.compose([Validators.required])],
                      input:['',Validators.compose([Validators.required,
                                                    this.emptyLineValidator,
                                                    this.whitespaceValidator,
                                                    this.mosquadIdValidator])]
               });

               this.filterServiceForm = this.formBuilder.group({
                       filterList0: this.formBuilder.group({
                           attributeTypes:['',Validators.compose([Validators.required])],
                           provider:['',Validators.compose([Validators.required])],
                           weight:['',Validators.compose([Validators.required])],
                           qualityFilterLow:['',Validators.compose([Validators.required])],
                           qualityFilterMedium:['',Validators.compose([Validators.required])],
                           qualityFilterHigh:['',Validators.compose([Validators.required])]
                       }),
                       preset:['',Validators.compose([Validators.required])],
                       instanceLabel:['',Validators.compose([Validators.required])],
                       publicationDate:['',Validators.compose([Validators.required])],
                       firstGenDriveType:['',Validators.compose([Validators.required])],
                       true1DriveType:['',Validators.compose([Validators.required])],
                       hereTrueDriveType:['',Validators.compose([Validators.required])],
                       areaOfInterest:['',Validators.compose([Validators.required])],
                       input:['',Validators.compose([Validators.required])],
                       driveStartDate:['',Validators.compose([Validators.required])],
                       driveEndDate:['',Validators.compose([Validators.required])],
                       qualityTreshold:['',Validators.compose([Validators.required])],
                       saveAsPreset:['',Validators.compose([Validators.required])],
                       presetLabel:['',Validators.compose([Validators.required])]
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
              }

              if(this.jobTYPE === 'Coverage CSV Generation') {
                 value.jobTypes = this.jobTYPE;
                 address = ('home/selvaraj/depthAutomation/jobs/CoverageCSVGeneration/input/').concat(value.env);
                 date = (value.pubDate).replace('/','_');
                 fileName = '/'+(value.city.toUpperCase())+'_'+ date + '_mosquad.csv';
                 address = address + fileName;
                 text = value.mosquadInput;
             }

             if(this.jobTYPE=== 'PostIngest Depth Statistics') {
                 value.jobTypes = this.jobTYPE;
                 address = ('home/selvaraj/depthAutomation/jobs/PostIngestDepthStatistics/input/').concat(value.env);
                 date = (value.pubDate).replace('/','_');
                 fileName = '/'+ date + '_mosquad.txt';
                 address = address + fileName;
                 text = value.postIngestInput;
             }

             if(this.jobTYPE === 'PreIngest') {
                 value.jobTypes = this.jobTYPE;
                 address = 'home/selvaraj/depthAutomation/jobs/PreIngest/input/';
                 date = (value.pubDate).replace('/','_');
                 fileName = (value.city.toUpperCase())+'_' + date + '_mosquads.txt';
                 address = address + fileName;
                 text = value.mosquadInput;
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
           this.formValues.jobType = 'Default';
           $('li.items').removeClass('highlight');

            return;
    }

      SelectJob(jobType, $event) {
           this.selectedJobType = jobType;
           $('li.items').removeClass('highlight');
           $($event.target).addClass('highlight');
      }

      addFilter(add:Boolean) {
          this._filterCurrentIndex = this._filterCurrentIndex + 1;
          this._filterIndices.push(this._filterCurrentIndex)
          this.filterList.push(
              {
               filterInputLow : '33',
               filterInputMedium : '33',
               filterInputHigh : '33'
              }
          );
          this.filterServiceForm.controls['filterList' + this._filterCurrentIndex] = this.formBuilder.group({
                           attributeTypes:['',Validators.compose([Validators.required])],
                           provider:['',Validators.compose([Validators.required])],
                           weight:['',Validators.compose([Validators.required])],
                           qualityFilterLow:['',Validators.compose([Validators.required])],
                           qualityFilterMedium:['',Validators.compose([Validators.required])],
                           qualityFilterHigh:['',Validators.compose([Validators.required])]
                       });
      }

      deleteFilter(idx:Number) {
          this.filterList.splice(idx, 1);
          this.filterServiceForm.controls['filterList' + this._filterIndices[idx]] = undefined;
          this._filterIndices.splice(idx, 1);
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
               if(!control.value.match(/^([A-Za-z,\s]*"([0-3]{14}){1}((\n)?[0-3]{14})*")*$/)) {
                   return {postIngest: true};
               }
      }

  }
