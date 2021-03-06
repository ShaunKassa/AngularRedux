
import { Directive,
         Input,
         Output,
         Renderer,
         ElementRef,
         EventEmitter,
         ContentChildren,
         QueryList,
         ViewContainerRef,
         OnInit,
         AfterViewInit,
         HostListener
} from '@angular/core';

import {Ng2StyledDirective} from './ng2-styled.directive';

export class BoundingRectClass {
    left:number;
    right:number;
    top:number;
    bottom:number;
}

export interface IEventSlideAble {
    type: string;
    boundingRect: ClientRect;
    relativePercentHorisontal: number;
    relativePercentVertical: number;
    elementId: string;
    instance: SlideAbleDirective;
}
export class EventSlideAble implements IEventSlideAble {
    boundingRect: ClientRect;
    relativePercentHorisontal: number;
    relativePercentVertical: number;
    elementId: string;
    constructor(public type: string, public instance:SlideAbleDirective) {}
}

@Directive({
    selector: '[slideAble]'
})
export class SlideAbleDirective implements OnInit, AfterViewInit {

    @Input() slideDirection:string;

    @Input() set boundElement(elementId:any) {
        this.signatures = {
            top: elementId + ':top',
            bottom: elementId + ':bottom',
            left: elementId + ':left',
            right: elementId + ':right'
        };
    };

    // Setting edges of slideable area
    @Input() set rightEdge(signature:string) {
        this.signatures.right = signature;
    }

    @Input() set leftEdge(signature:string) {
        this.signatures.left = signature;
    }

    @Input() set topEdge(signature:string) {
        this.signatures.top = signature;
    }

    @Input() set bottomEdge(signature:string) {
        this.signatures.bottom = signature;
    }

    // Setting dynamic limits of sliding
    @Input() set dynamicRightLimit(signature:string) {
        this.dynamicLimits.right = signature;
    }

    @Input() set dynamicLeftLimit(signature:string) {
        this.dynamicLimits.left = signature;
    }

    @Input() set dynamicTopLimit(signature:string) {
        this.dynamicLimits.top = signature;
    }

    @Input() set dynamicBottomLimit(signature:string) {
        this.dynamicLimits.bottom = signature;
    }

    /**
     * @deprecated
     */
    @Input() normalStyle: any;

    /**
     * @deprecated
     */
    @Input() slidingStyle: any;
    @Input() step: any = 1;
    @Input() parent: any = null;
    @Output() onStartSliding = new EventEmitter();
    @Output() onSliding = new EventEmitter();
    @Output() onStopSliding = new EventEmitter();
    @Output() onInit = new EventEmitter();

    @ContentChildren(Ng2StyledDirective) _styledDirectives:QueryList<Ng2StyledDirective>;

    public checkXBeforeRedraw:any = null;
    public checkYBeforeRedraw:any = null;
    public boundingRect:BoundingRectClass;
    private dynamicLimitRect:BoundingRectClass;

    private signatures:any = {
        top: '',
        left: '',
        bottom: '',
        right: ''
    };

    private dynamicLimits:any = {};
    private zeroLeft:any;
    private zeroTop:any;
    private lastX:any = null;
    private lastY:any = null;
    private styledInstance: any;
    private scrollPositionX: number;
    constructor(private el:ElementRef, private renderer: Renderer, private _view: ViewContainerRef) {
    }

   ngOnInit() {
        this.dynamicLimitRect = this.dynamicLimitRect || new BoundingRectClass();
        this.slideDirection = this.slideDirection || 'both';

        if (!this.signatures.left) this.signatures.left = 'parent:left';
        if (!this.signatures.right) this.signatures.right = 'parent:right';
        if (!this.signatures.top) this.signatures.top = 'parent:top';
        if (!this.signatures.bottom) this.signatures.bottom = 'parent:bottom';

        this.onInit.emit(new EventSlideAble('init', this));
    }

    ngAfterViewInit() {

        if (!this._styledDirectives.length && this.normalStyle && this.slidingStyle) {
            // if "styleable" directive is apsent and style infromation getting in deprecated format -
            // apply "styleable" directive with converted settings
            // in other case deprecated settings will be ignored
            this.styledInstance = new Ng2StyledDirective(this.el, <any>this._view);
            var styleBlockArray:any[] = [];

            if (this.normalStyle) {
                let styleBlock:any = '';
                for (let idx in this.normalStyle) {
                    styleBlock += `${idx}: ${this.normalStyle[idx]}; `;
                }
                if (styleBlock) styleBlockArray.push(`{${styleBlock}}`);
            }

            if (this.slidingStyle) {
                let styleBlock = '';
                for (let idx in this.slidingStyle) {
                    styleBlock += `${idx}: ${this.slidingStyle[idx]}; `;
                }
                if (styleBlock) styleBlockArray.push(`<.sliding {${styleBlock}}`);
            }
            this.styledInstance.styleBlock = styleBlockArray;
            this.styledInstance.ngAfterViewInit();

        } else {
            this.styledInstance = this._styledDirectives.first;
        }

        var timer:any;
        var scrollStartX = 0;
        var scrolling = false;

        this.scrollPositionX = window.pageXOffset;

        window.addEventListener('scroll', e => {
            if (this.slideDirection === 'horisontal' || this.slideDirection === 'both') {
                this.zeroTop = this.el.nativeElement.getBoundingClientRect().top -
                    parseInt(getComputedStyle(this.el.nativeElement).top) + window.pageYOffset;
                if (isNaN(this.zeroTop)) this.zeroTop = 0;
            }
            if (this.slideDirection === 'vertical' || this.slideDirection === 'both') {
                this.zeroLeft = this.el.nativeElement.getBoundingClientRect().left -
                    parseInt(getComputedStyle(this.el.nativeElement).left) - window.pageXOffset;
                if (isNaN(this.zeroLeft)) this.zeroLeft = 0;
            }

            this.lastX = this.el.nativeElement.getBoundingClientRect().left -
                parseInt(getComputedStyle(this.el.nativeElement).left) +
                Math.round(this.el.nativeElement.getBoundingClientRect().width / 2);
            if (isNaN(this.lastX)) this.lastX = Math.round(this.el.nativeElement.getBoundingClientRect().width / 2);

            if (this.lastX) this.lastX -= window.pageXOffset;
            if (this.zeroLeft) this.zeroLeft -= window.pageXOffset;

            clearTimeout(timer);
            if (!scrolling) scrollStartX = window.pageXOffset;
            scrolling = true;
            // timer = setTimeout( onScrollStop , 350 );
        });

     }
    @HostListener('mousedown')
    slideStart(e:any) {

        // deny dragging and selecting
        document.ondragstart = function () {
            return false;
        };
        document.body.onselectstart = function () {
            return false;
        };

        // Calculate dynamic limits every time when sliding was started
        this.calcDynamicLimits();

        function dragProcess(event:any) {
            this.redraw(event.clientX, event.clientY);
        }

        function dragProcessTouch(event:any) {
            var touches = event.changedTouches;
            console.log('Touch');
            for (var i = 0; i < touches.length; i++) {
                if (touches[i].target === this.el.nativeElement) {
                    console.log('Redraw');
                    this.redraw(touches[i].clientX, touches[i].clientY);
                }
            }
        }

        document.onmousemove = dragProcess.bind(this);
        document.ontouchmove = dragProcessTouch.bind(this);

        document.onmouseup = this.slideStop.bind(this);
        document.ontouchend = this.slideStop.bind(this);


        if (!this.lastX && this.slideDirection === 'vertical') {
            this.lastX = this.el.nativeElement.getBoundingClientRect().left -
                parseInt(getComputedStyle(this.el.nativeElement).left) +
                Math.round(this.el.nativeElement.getBoundingClientRect().width / 2);
            if (isNaN(this.lastX)) this.lastX = Math.round(this.el.nativeElement.getBoundingClientRect().width / 2);
        }
        if (!this.lastY && this.slideDirection === 'horisontal') {
            this.lastY = this.el.nativeElement.getBoundingClientRect().top -
                parseInt(getComputedStyle(this.el.nativeElement).top) +
                Math.round(this.el.nativeElement.getBoundingClientRect().height / 2);
            if (isNaN(this.lastY)) this.lastY = Math.round(this.el.nativeElement.getBoundingClientRect().height / 2);
        }

        if (window.pageXOffset !== this.scrollPositionX) {
            let delta = window.pageXOffset - this.scrollPositionX;
            if (this.lastX) this.lastX -= delta;
            if (this.zeroLeft) this.zeroLeft -= delta;
            this.scrollPositionX = window.pageXOffset;
        }

        this.lastX = this.el.nativeElement.getBoundingClientRect().left +
            Math.round(this.el.nativeElement.getBoundingClientRect().width / 2);

        this.boundingRect = new BoundingRectClass();
        this.calcMargins();
        // this.zeroLeft = this.el.nativeElement.getBoundingClientRect().left -
        // parseInt(getComputedStyle(this.el.nativeElement).left) - window.pageXOffset;
        // if (!this.zeroLeft) {
        //     this.zeroLeft = this.el.nativeElement.getBoundingClientRect().left -
        //     parseInt(getComputedStyle(this.el.nativeElement).left);
        //     if (isNaN(this.zeroLeft)) this.zeroLeft = 0;
        // }

        // Change styles
        this.renderer.setElementClass(this.el.nativeElement, 'sliding', true);
        if (this.lastX && (this.slideDirection === 'horisontal' || this.slideDirection === 'both')) {
            // this.el.nativeElement.style.left = this.lastX - this.zeroLeft -
            // Math.round(this.el.nativeElement.getBoundingClientRect().width / 2) + window.pageXOffset + 'px';
            this.el.nativeElement.style.left = this.lastX - this.zeroLeft -
                Math.round(this.el.nativeElement.getBoundingClientRect().width / 2) + 'px';
        }
        if (this.lastY && (this.slideDirection === 'vertical' || this.slideDirection === 'both')) {
            // this.el.nativeElement.style.top = this.lastY - this.zeroTop -
            // Math.round(this.el.nativeElement.getBoundingClientRect().height / 2) + window.pageYOffset + 'px';
            this.el.nativeElement.style.top = this.lastY - this.zeroTop -
                Math.round(this.el.nativeElement.getBoundingClientRect().height / 2) + 'px';
        }

        this.onStartSliding.emit(this.prepareEventData('start'));
    }

    /**
     * Move handle and change value in according to coordinate
     *
     * @param x
     * @param y
     * @returns {*}
     */
    redraw(x:any, y:any) {

        // We can't calculate any values that depends from coordinates in ngOnInit, because may be not all page was rendered
        // That's why we calculate these values here
        if (!this.boundingRect) {
            this.boundingRect = new BoundingRectClass();
            this.calcMargins();
        }

        if (window.pageXOffset !== this.scrollPositionX) {
            let delta = window.pageXOffset - this.scrollPositionX;
            if (this.lastX) this.lastX -= delta;
            if (this.zeroLeft) this.zeroLeft -= delta;
            this.scrollPositionX = window.pageXOffset;
        }

        if (typeof(this.zeroLeft) === 'undefined') {
            this.zeroLeft = this.el.nativeElement.getBoundingClientRect().left - parseInt(getComputedStyle(this.el.nativeElement).left);
            if (isNaN(this.zeroLeft)) this.zeroLeft = 0;
        }
        if (typeof(this.zeroTop) === 'undefined') {
            this.zeroTop = this.el.nativeElement.getBoundingClientRect().top - parseInt(getComputedStyle(this.el.nativeElement).top);
            if (isNaN(this.zeroTop)) this.zeroTop = 0;
        }

        if (this.slideDirection === 'horisontal' || this.slideDirection === 'both') {
            if (this.lastX) {
                let k = (x - this.lastX) / this.step;
                x = this.lastX + Math.round(k) * this.step;
            }
            if (x - this.boundingRect.left < -0.8) {
                x = this.lastX + Math.ceil((this.boundingRect.left - this.lastX) / this.step) * this.step;
            }
            // if (x + window.pageXOffset - this.boundingRect.right > 0.5) {
            //     x = this.lastX  + Math.floor((this.boundingRect.right - window.pageXOffset - this.lastX) / this.step) * this.step;
            // }
            if (x - this.boundingRect.right > 0.8) {
                x = this.lastX + Math.floor((this.boundingRect.right - this.lastX) / this.step) * this.step;
            }

            if (!!this.dynamicLimitRect.left && x < this.dynamicLimitRect.left) x = this.dynamicLimitRect.left;
            if (!!this.dynamicLimitRect.right && x > this.dynamicLimitRect.right) x = this.dynamicLimitRect.right;
            // Check callback result to make decigion change horisontal position or not
            if ((typeof(this.checkXBeforeRedraw) !== 'function' || this.checkXBeforeRedraw(x, y)) && x !== this.lastX) {
                // this.el.nativeElement.style.left = x - this.zeroLeft -
                // Math.round(this.el.nativeElement.getBoundingClientRect().width / 2) + window.pageXOffset + 'px';
                this.el.nativeElement.style.left = x - this.zeroLeft -
                    Math.round(this.el.nativeElement.getBoundingClientRect().width / 2) + 'px';
                this.lastX = x;
            }
        }

        if (this.slideDirection === 'vertical' || this.slideDirection === 'both') {
            if (this.lastY) {
                let k = (y - this.lastY) / this.step;
                y = this.lastY + Math.round(k) * this.step;
            }

            if (y - this.boundingRect.top < -0.5) {
                y = this.lastY + Math.ceil((this.boundingRect.top - this.lastY) / this.step) * this.step;
            }
            if (y - this.boundingRect.bottom > 0.5) {
                y = this.boundingRect.bottom;
                y = this.lastY + Math.floor((this.boundingRect.bottom - this.lastY) / this.step) * this.step;
            }

            if (!!this.dynamicLimitRect.top && y < this.dynamicLimitRect.top) y = this.dynamicLimitRect.top;
            if (!!this.dynamicLimitRect.bottom && y > this.dynamicLimitRect.bottom) y = this.dynamicLimitRect.bottom;

            // Check callback result to make decigion change horisontal position or not
            if ((typeof(this.checkYBeforeRedraw) !== 'function' || this.checkYBeforeRedraw(x, y)) && y !== this.lastY) {
                // this.el.nativeElement.style.top = y - this.zeroTop -
                // Math.round(this.el.nativeElement.getBoundingClientRect().height / 2) + window.pageYOffset + 'px';
                this.el.nativeElement.style.top = y - this.zeroTop -
                    Math.round(this.el.nativeElement.getBoundingClientRect().height / 2) + 'px';
                this.lastY = y;
            }
        }

        this.onSliding.emit(this.prepareEventData('sliding'));
    }

    slideStop(event:any) {
        this.onStopSliding.emit(this.prepareEventData('stop'));
        document.onmousemove = null;
        document.ontouchmove = null;
        document.onmouseup = null;
        document.ontouchend = null;

        this.renderer.setElementClass(this.el.nativeElement, 'sliding', false);
        if (this.slideDirection === 'horisontal' || this.slideDirection === 'both') {
            var newLeft = this.lastX - this.zeroLeft - Math.round(this.el.nativeElement.getBoundingClientRect().width / 2);
            // if (this.slideDirection === 'horisontal' || this.slideDirection === 'both') {
            // newLeft += window.pageXOffset;
            // }
            this.el.nativeElement.style.left = newLeft + 'px';
        }
        if (this.slideDirection === 'vertical' || this.slideDirection === 'both') {
            var newTop = this.lastY - this.zeroTop - Math.round(this.el.nativeElement.getBoundingClientRect().height / 2);
            // if (this.slideDirection === 'vertical' || this.slideDirection === 'both') {
            // newTop += window.pageYOffset;
            // }
            this.el.nativeElement.style.top = newTop + 'px';
        }
    }

    prepareEventData(type:any) :IEventSlideAble {
        let result = new EventSlideAble(type, this);
        result['boundingRect'] = this.el.nativeElement.getBoundingClientRect();
        result['relativePercentHorisontal'] = Math.round(100 * (result['boundingRect'].left + Math.round(result['boundingRect'].width / 2) -
                                                        this.boundingRect.left) / (this.boundingRect.right - this.boundingRect.left));
        result['relativePercentVertical'] = Math.round(100 * (result['boundingRect'].top + Math.round(result['boundingRect'].height / 2) -
                                                        this.boundingRect.top) / (this.boundingRect.bottom - this.boundingRect.top));
        result['elementId'] = this.el.nativeElement.id;
        return result;
    }

    // Calculating all margins of common sliding area
    calcMargins() {
        for (let idx in this.signatures) {
            let el:any, side:any;
            [el, side] = this.splitSignature(this.signatures[idx]);
            if (!side) {
                if (idx === 'top' || idx === 'bottom') side = 'center-y';
                if (idx === 'left' || idx === 'right') side = 'center-x';
            }
            let result = this.getMargin(el, side);
            (<any>this.boundingRect)[idx] = result;
        }
    }

    // Calculating dynamic sliding limits
    calcDynamicLimits() {
        for (let idx in this.dynamicLimits) {
            if (!this.dynamicLimits[idx]) continue;
            let el:any, side:any;
            [el, side] = this.splitSignature(this.dynamicLimits[idx]);
            if (!side) {
                if (idx === 'top' || idx === 'bottom') side = 'center-y';
                if (idx === 'left' || idx === 'right') side = 'center-x';
            }
            let result = this.getMargin(el, side);
            (<any>this.dynamicLimitRect)[idx] = result;
        }
    }

    // Extract from 'element:side' fromat element object and side
    // If element missed or not finded, get parent as element
    splitSignature(signature:string) {
        let tmp = signature.split(':', 2);
        let el:any, side:any;
        side = tmp[1];
        if (tmp[0] === '') {
            el = this.el.nativeElement.parentElement;
        } else {
            el = document.getElementById(tmp[0]);
            if (!el) el = this.el.nativeElement.parentElement;
        }
        el = el || null;
        side = side || null;
        return [el, side];
    }

    // Getting coordinate of certain side (or center) of DOM-element
    getMargin(el:any, side:string) {
        let boundingRect = el.getBoundingClientRect();
        let result:any;
        side = side.toLowerCase();
        switch (side) {
            case 'left':
            case 'right':
            case 'top':
            case 'bottom':
                result = boundingRect[side];
                break;
            case 'center-x':
                result = boundingRect.left + Math.round(boundingRect.width / 2);
                break;
            case 'center-y':
                result = boundingRect.top + Math.round(boundingRect.height / 2);
                break;
            default:
                result = null;
                break;
        }
        return result;
    }
}
