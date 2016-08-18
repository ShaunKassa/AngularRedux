import { NgModule, ModuleWithProviders } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/index';
import { Ng2SliderComponent } from './slider/ng2-slider.component';

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
    declarations: [ NavbarComponent, Ng2SliderComponent ],
    exports: [ NavbarComponent, Ng2SliderComponent, CommonModule, FormsModule, ReactiveFormsModule ],
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
