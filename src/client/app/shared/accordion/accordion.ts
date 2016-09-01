import {Component, Input, Output, EventEmitter, OnDestroy} from '@angular/core';

@Component({
  selector: 'aethic-accordion',
  template:`
  <ng-content></ng-content>
          `
})
export class AccordionComponent {
  groups: Array<AccordionGroupComponent> = [];

  addGroup(group: AccordionGroupComponent): void {
    this.groups.push(group);
  }

  closeOthers(openGroup: AccordionGroupComponent): void {
    this.groups.forEach((group: AccordionGroupComponent) => {
      if (group !== openGroup) {
        group.isOpen = false;
      }
    });
  }

  removeGroup(group: AccordionGroupComponent): void {
    const index = this.groups.indexOf(group);
    if (index !== -1) {
      this.groups.splice(index, 1);
    }
  }
}

@Component({
  moduleId: module.id,
  selector: 'aethic-accordion-group',
  template:`
                <div class="panel" [ngClass]="{'panel-open': isOpen}">
                  <div class="panel-heading" (click)="toggleOpen($event)">
                    <div class="panel-title">{{heading}}</div>
                    <img src="../../../assets/icons/dropdown_open.png"/>
                  </div>
                  <div [hidden]="!isOpen">
                    <ng-content></ng-content>
                  </div>
                </div>
          `,

  styleUrls: ['accordion.css']
})
export class AccordionGroupComponent implements OnDestroy {
  @Input() heading: string;
  @Output() onExpandGroup = new EventEmitter();

  private _isOpen:boolean = false;


  @Input()
  set isOpen(value: boolean) {
    this._isOpen = value;
    if (value) {
      this.accordion.closeOthers(this);
    }
  }

  get isOpen() {
    return this._isOpen;
  }

  constructor(private accordion: AccordionComponent) {
    this.accordion.addGroup(this);
  }

  ngOnDestroy() {
    this.accordion.removeGroup(this);
  }

  toggleOpen(event: MouseEvent): void {
    event.preventDefault();
    this.isOpen = !this.isOpen;
    this.onExpandGroup.emit(this.isOpen);
  }
}
