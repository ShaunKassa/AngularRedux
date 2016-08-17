import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';


import  AppComponent from './app.component';
import { routing } from './app.routing';

/* Feature Modules */
import { JobsModule } from './+jobs/jobs.module';
import { SharedModule } from './shared/shared.module';


@NgModule({
    imports: [ 
        BrowserModule, 
        HttpModule, 
        routing, 
        SharedModule.forRoot(), 
        JobsModule 
    ],
    declarations: [ 
        AppComponent 
    ],
    bootstrap: [ 
        AppComponent 
    ]
})
export class AppModule {}
