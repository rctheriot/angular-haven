import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http'
import { NgModule } from '@angular/core';
import { routes } from './app.routes';

// Firebase Modules
import * as firebase from 'firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from './auth.service'
import { AuthGuard } from './auth-guard.service';
import { environment } from '../environments/environment';

// Material & Leaflet
import { AppMaterialModules } from './shared/material.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import 'hammerjs';

// My Modules
import { PlotlyChartsModule } from './plotly-charts/plotly-charts.module';
import { SidebarsModule } from './sidebars/sidebars.module';

// My Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './home/home.component';
import { WindowComponent } from './window/window.component';
import { LeafmapComponent } from './leaflet/leafmap/leafmap.component';

// My Services
import { WindowService } from './window/shared/window.service';
import { LeafMapService } from './leaflet/leafmap.service';
import { PlotlyChartsService } from './plotly-charts/service/plotly-charts.service';

import { DirectivesModule } from './shared/directives.module'

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    routes,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    PlotlyChartsModule,
    SidebarsModule,
    AppMaterialModules,
    LeafletModule.forRoot(),
    DirectivesModule
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    MainComponent,
    HomeComponent,
    WindowComponent,
    LeafmapComponent,
  ],
  providers: [
    AuthService,
    AuthGuard,
    WindowService,
    LeafMapService,
    PlotlyChartsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
