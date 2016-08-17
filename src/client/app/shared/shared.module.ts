import { NgModule, ModuleWithProviders } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/index';

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
    imports: [ CommonModule ],
    declarations: [ NavbarComponent ],
    exports: [ NavbarComponent ],
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
            instrumentStore({
              monitor: useLogMonitor({
                  // Default log monitor options
                  position: 'right',
                  visible: true,
                  size: 0.3
              })
            }),
            services, 
            provideStore(reducer), 
            runEffects(effects), 
            actions ]
        };
    }
}
