import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http'
import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { routes } from './app.routes';
import { AuthService } from './auth.service'
import { AuthGuard } from './auth-guard.service';
import { AgmCoreModule } from '@agm/core';
import { AngularEsriModule } from 'angular-esri-components';
import { EsriLoaderService } from 'angular2-esri-loader';
import { environment } from '../environments/environment';
import 'hammerjs';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TableComponent } from './shared/table/table.component';
import { ExampleComponent } from './example/example.component';
import { NgxguageComponent } from './shared/ngxguage/ngxguage.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgxlineComponent } from './shared/ngxline/ngxline.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { GmapComponent } from './shared/gmap/gmap.component';
import { ThreejsComponent } from './shared/threejs/threejs.component';
import { NgxradarComponent } from './shared/ngxradar/ngxradar.component';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { EsriMapV2Component } from './esri-map-v2/esri-map-v2.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxChartsModule,
    HttpModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MaterialModule,
    AngularEsriModule,
    routes,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBKzKeYcswjXCTr0oww5CyaIn86t_VEaKw'
    })
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    TableComponent,
    ExampleComponent,
    NgxguageComponent,
    SidebarComponent,
    NgxlineComponent,
    LoginComponent,
    HomeComponent,
    GmapComponent,
    ThreejsComponent,
    NgxradarComponent,
    EsriMapComponent,
    EsriMapV2Component,
  ],
  providers: [AuthService, AuthGuard, EsriLoaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
