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
import { environment } from '../environments/environment';
import 'hammerjs';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TableComponent } from './shared/table/table.component';
import { NgxguageComponent } from './shared/ngx/ngxguage/ngxguage.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgxlineComponent } from './shared/ngx/ngxline/ngxline.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ThreejsComponent } from './shared/threejs/threejs.component';
import { NgxradarComponent } from './shared/ngx/ngxradar/ngxradar.component';

import { Example2Component } from './example2/example2.component';
import { WindowComponent } from './shared/window/window.component';
import { Arcgis3dMapComponent } from './shared/arcgis/arcgis-3d-map/arcgis-3d-map.component';


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
    NgxguageComponent,
    SidebarComponent,
    NgxlineComponent,
    LoginComponent,
    HomeComponent,
    ThreejsComponent,
    NgxradarComponent,
    Example2Component,
    WindowComponent,
    Arcgis3dMapComponent,
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
