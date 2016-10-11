declare var AWS: any;
import { Store } from '@ngrx/store';
import { Component, OnInit, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { JobsService } from '../../shared/services/index';
import { getJobInputsState } from '../../shared/reducers/index';

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
        'Coverage CSV Generation'
        // 'Filter Service'
    ];
    inputs: any;
    regExMap = {
        'mosquads':'^((?![0-3]{14}).)*$',
        'drives':'^((?!HT[\\w\\d]+_(\\d)+,?.*\\s*).)*$'
    };


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
         private _store: Store<any>,
         private formBuilder:FormBuilder,
         private _jobsService: JobsService,
         private renderer: Renderer,
         private _elementRef: ElementRef) {
        this.inputs = _store.let(getJobInputsState())
            .map(jobInputState => jobInputState.jobInputs);
     }
     ngOnInit() {
         this.createForms();
     }


    createForms() {
             this.depthGenerationForm = this.formBuilder.group({
                   city: ['',Validators.compose([Validators.required, this.underscoreValidator])],
                   publicationDate:['',Validators.compose([Validators.required])],
 	    		   validationType:['validatePanoCount',Validators.compose([Validators.required])],
                   submissionType:['',Validators.compose([Validators.required])],
                   inputType:['',Validators.compose([Validators.required])],
                   input:['',Validators.compose([Validators.required,
                                                  this.emptyLineValidator,
                                                  this.whitespaceValidator])]
               }, {validator: this.validateDepthInputs()});

              this.postIngestForm = this.formBuilder.group({
                      publicationDate:['',Validators.compose([Validators.required])],
	    			  environment:['',Validators.compose([Validators.required])],
	    			  inputType:['',Validators.compose([Validators.required])],
	    			  jobInput:[''],
                      mosquadInput:['',Validators.compose([this.emptyLineValidator,
                                                    this.whitespaceValidator,
                                                    this.mosquadIdValidator])]
               }, {validator: this.validateMosquadInputs()});


               this.coverageCsvForm= this.formBuilder.group({
                      city: ['',Validators.compose([Validators.required, this.underscoreValidator])],
                      publicationDate:['',Validators.compose([Validators.required])],
	    			  environment:['',Validators.compose([Validators.required])],
	    			  inputType:['',Validators.compose([Validators.required])],
	    			  jobInput:[''],
                      mosquadInput:['',Validators.compose([this.emptyLineValidator,
                                                    this.whitespaceValidator,
                                                    this.mosquadIdValidator])]
               }, {validator: this.validateMosquadInputs()});


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
               let that = this;
 			   let address: string = '';
 			   let fileName: string = '';
 			   let text: string = '';
               let date: string = '';
               let guid: any = this.createGuid();

               if(this.selectedJobType === 'CSV Generation') {
                   this.buildFilterModel(value);
                   return;
               }
               if(this.selectedJobType === 'Depth Generation') {
                   address = (
                       'depthAutomation/jobs/DepthGenerationForCity/input/validatePanoCount/').concat(value.submissionType)
                       ;
                   fileName = '/'+(value.city)+'_'+ value.publicationDate + '_' + value.inputType +'_' + guid + '.txt';
                   address = address + fileName;
                   console.log(address);
                   text = value.input;
              }

              if(this.selectedJobType === 'Coverage CSV Generation') {
                 address = ('depthAutomation/jobs/CoverageCSVGeneration/input/').concat(value.environment);
                 fileName = '/'+(value.city)+'_'+ value.publicationDate + '_mosquad_' + guid + '.csv';
                 address = address + fileName;
                 if(value.inputType === 'mosquads') {
                    text = value.mosquadInput;
                 } else {
                     text = value.jobInput;
                 }
             }

             if(this.selectedJobType=== 'PostIngest Depth Statistics') {
                 address = ('depthAutomation/jobs/PostIngestDepthStatistics/input/').concat(value.environment);
                 date = (value.publicationDate).replace('/','_');
                 fileName = '/'+ date + '_mosquad.txt';
                 address = address + fileName;
                 if(value.inputType === 'mosquads') {
                    text = value.mosquadInput;
                 } else {
                     text = value.jobInput;
                 }
             }


            if(value.inputType === 'mosquads' || value.inputType === 'drives') {
                var bucket = new AWS.S3({params: {Bucket: 'aethicupload'}});
                var params = {Key: address, Body: text};
                bucket.upload(params, function (err:any) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log('Success');
                        that._jobsService.createJob(address, value.jobInput)
                            .subscribe(x => {
                                that.createForms();
                            });
                    }
                });
            } else { // for output
                that._jobsService.createJob(address, value.jobInput)
                    .subscribe(x => {
                        that.createForms();
                    });
            }
           this.selectedJobType = 'Default';
           this.SelectJob('Default', null);
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
           if($event) {
                this.renderer.setElementStyle($event.target, 'backgroundColor', '#FFFFFF');
           }
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

      createGuid() {
          return 'xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
              return v.toString(16);
          });
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

      private underscoreValidator(control: FormControl) {
               if(control.value.includes('_')) {
                   return {underscoreValid: true};
               }
               return;
      }


      private validateMosquadInputs() {
          return (group: FormGroup) => {
              let mosquadInput = group.controls['mosquadInput'],
                  jobInput = group.controls['jobInput'];
              if(mosquadInput.value === '' && jobInput.value === '') {
                  return {
                      mosquadInputRequired: true
                  };
              } else return;
          };
      }

      private validateDepthInputs(): (group: FormGroup) => any {
          return (group: FormGroup) => {
              let input = group.controls['input'],
                  inputType = group.controls['inputType'];
              if(inputType.value === 'mosquads' && !input.value.match(/^([0-3]{14}\s*)*$/)) {
                  return {mosquadId: true};
              } else if(inputType.value === 'drives' && !input.value.match(/^(HT[\w\d]+_(\d)+,?.*\s*)*$/)) {
                  return {driveId: true};
              } else return;
          };
      }


  }
