import { NgModule, ModuleWithProviders } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/index';
import { AccordionComponent, AccordionGroupComponent } from './accordion/accordion';
import { Ng2SliderComponent } from './slider/ng2-slider.component';
import { SlideAbleDirective } from './slider/slideable.directive';
import { Ng2StyledDirective } from './slider/ng2-styled.directive';
import { OverviewChartComponent } from './overviewChart/overview-chart.component';
import { DetailviewChartComponent } from './detailviewChart/detailview-chart.component';
import { MosquadsInputComponent } from './mosquadInput/mosquads-input.component';

/* Store related imports */
import { provideStore } from '@ngrx/store';
import { runEffects } from '@ngrx/effects';
import { instrumentStore } from '@ngrx/store-devtools';
import { useLogMonitor } from '@ngrx/store-log-monitor';
import reducer from './reducers/index';
import effects from './effects/index';
import actions from './actions/index';

/* services */
import services from './services/index';

@NgModule({
    imports: [ CommonModule, HttpModule, FormsModule ],
    declarations: [
        NavbarComponent,
        AccordionComponent,
        AccordionGroupComponent,
        Ng2SliderComponent,
        SlideAbleDirective,
        Ng2StyledDirective,
        OverviewChartComponent,
        DetailviewChartComponent,
        MosquadsInputComponent ],
    exports: [
        NavbarComponent, Ng2SliderComponent, AccordionComponent, AccordionGroupComponent,
        OverviewChartComponent, DetailviewChartComponent, MosquadsInputComponent,
        CommonModule, FormsModule, ReactiveFormsModule ],
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
            {
                provide: APP_BASE_HREF,
                useValue: '<%= APP_BASE %>'
            },
            provideStore(reducer),
            instrumentStore({
              monitor: useLogMonitor({
                  // Default log monitor options
                  position: 'right',
                  visible: true,
                  size: 0.3
              })
            }),
            services,
            runEffects(effects),
            actions ]
        };
    }
}
