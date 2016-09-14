declare var AWS: any;
import { Component, OnInit, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';

import { JobsService } from '../../shared/services/jobs.service';

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
    _filterIndices:any;
    jobTypesList = [
        'Depth Generation',
        'PostIngest Depth Statistics',
        'Coverage CSV Generation',
        'Filter Service'
    ];


    attributeTypes = ['ORIENT','XYALIGN','ZJUMP','INTERVAL','DRIFT',
                      'LOWERED','ACCURACY','LENSOB','UNDEREXP','OVEREXP',
                      'FOGGING','CARMASK','SEAMLINE','SINGLE_CAM_EXP','ALIGNMENT',
                      'DROPPACK','SENSORCAL','LIDARFAIL','SKYNOISE'
    ];

    filterList: any[] = [
        {
            filterInputLow : 33,
            filterInputMedium : 33,
            filterInputHigh : 33,
            weight: 0
        }
    ];

    selectedJobType = 'Default';
    @ViewChild('items') itemsRef:ElementRef;

     constructor(
         private formBuilder:FormBuilder,
         private _jobsService: JobsService,
         private renderer: Renderer,
         private _elementRef: ElementRef) { }
         ngOnInit() {
             this.depthGenerationForm = this.formBuilder.group({
                   city: ['',Validators.compose([Validators.required])],
                   publicationDate:['',Validators.compose([Validators.required])],
 	    		   validationType:['validatePanoCount',Validators.compose([Validators.required])],
                   submissionType:['',Validators.compose([Validators.required])],
                   input:['',Validators.compose([Validators.required,
                                                  this.emptyLineValidator,
                                                  this.whitespaceValidator,
                                                  this.mosquadIdValidator])]
               });

              this.postIngestForm = this.formBuilder.group({
                      publicationDate:['',Validators.compose([Validators.required])],
	    			  environment:['',Validators.compose([Validators.required])],
	    			  inputType:['',Validators.compose([Validators.required])],
                      input:['',Validators.compose([Validators.required,
                                                    this.emptyLineValidator,
                                                    this.whitespaceValidator,
                                                    this.postIngestValidator])]
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

       //        this.preIngestForm = this.formBuilder.group({
       //               city: ['',Validators.compose([Validators.required])],
       //               publicationDate:['',Validators.compose([Validators.required])],
	   // 			  environment:['dev',Validators.compose([Validators.required])],
	   // 		      inputType:['mosquads',Validators.compose([Validators.required])],
       //               input:['',Validators.compose([Validators.required,
       //                                             this.emptyLineValidator,
       //                                             this.whitespaceValidator,
       //                                             this.mosquadIdValidator])]
       //        });

               this.filterServiceForm = this.formBuilder.group({
                       filterList: new FormArray([this.formBuilder.group({
                           attributeTypes:['',Validators.compose([Validators.required])],
                           provider:['',Validators.compose([Validators.required])],
                           weight:['',Validators.compose([Validators.required])],
                           qualityFilterLow:['',Validators.compose([Validators.required])],
                           qualityFilterMedium:['',Validators.compose([Validators.required])],
                           qualityFilterHigh:['',Validators.compose([Validators.required])]
                       })]),
                       preset:['',Validators.compose([])],
                       instanceLabel:['',Validators.compose([Validators.required])],
                       publicationDate:['',Validators.compose([Validators.required])],
                       firstGenDriveType:['',Validators.compose([])],
                       true1DriveType:['',Validators.compose([])],
                       hereTrueDriveType:['',Validators.compose([])],
                       areaOfInterest:['Bounding Box',Validators.compose([Validators.required])],
                       input:['',Validators.compose([Validators.required])],
                       driveStartDate:['',Validators.compose([Validators.required])],
                       driveEndDate:['',Validators.compose([Validators.required])],
                       qualityThreshold:['',Validators.compose([Validators.required])],
                       saveAsPreset:['',Validators.compose([])],
                       presetLabel:['',Validators.compose([Validators.required])]
               });
     }



    onSubmit(value:any): void {
 			   let address: string = '';
 			   let fileName: string = '';
 			   let text: string = '';
               let date: string = '';

               if(this.selectedJobType === 'CSV Generation') {
                   this.buildFilterModel(value);
                   return;
               }
               if(this.selectedJobType === 'Depth Generation') {
                   address = (
                       'home/selvaraj/depthAutomation/jobs/DepthGenerationForCity/input/validatePanoCount/').concat(value.submissionType)
                       ;
                   date = (value.pubDate).replace('/','_');
                   fileName = '/'+(value.city.toUpperCase())+'_'+ date + '_drives.txt';
                   address = address + fileName;
                   text = value.driveInput;
              }

              if(this.selectedJobType === 'Coverage CSV Generation') {
                 address = ('home/selvaraj/depthAutomation/jobs/CoverageCSVGeneration/input/').concat(value.env);
                 date = (value.pubDate).replace('/','_');
                 fileName = '/'+(value.city.toUpperCase())+'_'+ date + '_mosquad.csv';
                 address = address + fileName;
                 text = value.mosquadInput;
             }

             if(this.selectedJobType=== 'PostIngest Depth Statistics') {
                 address = ('home/selvaraj/depthAutomation/jobs/PostIngestDepthStatistics/input/').concat(value.env);
                 date = (value.pubDate).replace('/','_');
                 fileName = '/'+ date + '_mosquad.txt';
                 address = address + fileName;
                 text = value.postIngestInput;
             }

             if(this.selectedJobType === 'PreIngest') {
                 address = 'home/selvaraj/depthAutomation/jobs/PreIngest/input/';
                 date = (value.pubDate).replace('/','_');
                 fileName = (value.city.toUpperCase())+'_' + date + '_mosquads.txt';
                 address = address + fileName;
                 text = value.mosquadInput;
             }
            var bucket = new AWS.S3({params: {Bucket: 'aethicupload'}});
            var params = {Key: address, Body: text};
            bucket.upload(params, function (err:any) {
                if(err) {
                   console.log(err);
                } else {
                   console.log('Success');
                }
           });
           this.selectedJobType = 'Default';
           (<any>$('li.items')).removeClass('highlight');

            return;
    }

    buildFilterModel(value:any) {
        this.filterList.forEach((filter: any, index: number) => {
            value.filterList[index].qualityFilterHigh = filter.filterInputHigh;
            value.filterList[index].qualityFilterLow = filter.filterInputLow;
            value.filterList[index].qualityFilterMedium = filter.filterInputMedium;
            value.filterList[index].weight = filter.weight;
        });
        let providers:any[] = [];
        this.filterList.forEach((filter: any, index: number) => {
            providers[index] = {
                provider: {
                    provider: value.filterList[index].provider,
                    name: value.filterList[index].attributeTypes
                },
                weight: value.filterList[index].weight,
                qweihgts:[
                {
                    name: 'LOW',
                    weight: value.filterList[index].qualityFilterLow
                },
                {
                    name: 'MEDIUM',
                    weight: value.filterList[index].qualityFilterMedium
                },
                {
                    name: 'HIGH',
                    weight: value.filterList[index].qualityFilterHigh
                }
                ]
            };
        });

        let box = value.input.split(',');
        let filterPayload = {
            minLat: box[0],
            minLon: box[1],
            maxLat: box[2],
            maxLon: box[3],
            dataFormats: 'AMA',
            kind: 'box',
            qualityFilter: {
                qualityThreshold: value.qualityThreshold,
                providers: providers
            }
        };
        console.log(filterPayload);
        this._jobsService.saveFilters(filterPayload).subscribe(data => console.log(data));
        /*
        {
          "minLat": 48.82324,
          "minLon": 2.32910,
          "maxLat": 48.84521,
          "maxLon": 2.35107,
          "dataFormats": "AMA",
          "qualityFilter": {
            "qualityThreshold": 50,
            "providers": [
              {
                "provider": {
                  "provider": "RCP",
                  "name": "RCP"
                },
                "weight": 100,
                "qweights": [
                  {
                    "name": "OVEREXP",
                    "weight": 100
                  }
                ]
              }
            ]
          },
          "kind": "box"
        }
 
         */
    }

      SelectJob(jobType:any, $event:any) {
           this.selectedJobType = jobType;
           for(var len =0; len < this.itemsRef.nativeElement.children.length; len++) {
               this.itemsRef.nativeElement.children[len].style.backgroundColor = '#EBF0F2';
           }
           this.renderer.setElementStyle($event.target, 'backgroundColor', '#FFFFFF');
      }

      addFilter(add:Boolean) {
          this.filterList.push(
              {
               filterInputLow : 33,
               filterInputMedium : 33,
               filterInputHigh : 33,
               weight: 0
              }
          );
          (<FormArray>this.filterServiceForm.controls['filterList']).push(this.formBuilder.group({
                           attributeTypes:['',Validators.compose([Validators.required])],
                           provider:['',Validators.compose([Validators.required])],
                           weight:['',Validators.compose([Validators.required])],
                           qualityFilterLow:['',Validators.compose([Validators.required])],
                           qualityFilterMedium:['',Validators.compose([Validators.required])],
                           qualityFilterHigh:['',Validators.compose([Validators.required])]
                       }));
      }

      deleteFilter(idx:number) {
          this.filterList.splice(idx, 1);
          (<FormArray>this.filterServiceForm.controls['filterLists']).removeAt(idx);
          this._filterIndices.splice(idx, 1);
      }


      rangeValueChanged($event:any, idx:any) {
          this.filterList[idx].filterInputLow = $event.startValue;
          this.filterList[idx].filterInputMedium = $event.midValue;
          this.filterList[idx].filterInputHigh = $event.endValue;
      }

      highlightError(input:any) {
          let lines = input.target.value.split('\n');
          let textValue = '';
          for (let i=0; i < lines.length; i++) {
             if (!(/^([0-3]{14}\s*)*$/.test(lines[i]))) {
                 textValue.concat('<span class="red">' + lines[i] + '<br></span>');
             } else {
                 textValue.concat(lines[i] + '<br>');
             }
          }
          console.log(textValue);
      }

      private emptyLineValidator(control: FormControl) {
               if(control.value.match(/\n\s*\n/) ) {
                   return {emptyLine: true};
               }
               return;
      }

      private whitespaceValidator(control: FormControl) {
               if(control.value.match(/^ +/m) || control.value.match(/[ \t]+$/m) ) {
                   return {whitespace: true};
               }
               return;
      }

     //  private driveIdValidator(control: FormControl) {
     //           if(!control.value.match(/^(HT[\w\d]+_(\d)+,?.*\s*)*$/)) {
     //               return {driveId: true};
     //           }
     //           return;
     //  }

      private mosquadIdValidator(control: FormControl) {
               if(!control.value.match(/^([0-3]{14}\s*)*$/)) {
                   return {mosquadId: true};
               }
               return;
      }

      private postIngestValidator(control: FormControl) {
               if(!control.value.match(/^([A-Za-z,\s]*"([0-3]{14}){1}((\n)?[0-3]{14})*")*$/)) {
                   return {postIngest: true};
               }
               return;
      }

  }
