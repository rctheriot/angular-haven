import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http'
import { NgModule } from '@angular/core';
import { routes } from './app.routes';

// Firebase Modules
import { AngularFireModule, FirebaseApp } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from './auth.service'
import { AuthGuard } from './auth-guard.service';
import { environment } from '../environments/environment';

// Material & GoogleMaps
import { MaterialModule } from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import 'hammerjs';

// My Modules
import { NgxGraphsModule } from './ngx-graphs/ngx-graphs.module';
import { SidebarsModule } from './sidebars/sidebars.module';


// My Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './home/home.component';
import { WindowComponent } from './window/window.component';

// My Services
import { WindowService } from './window/shared/window.service';
import { LeaflayersService } from './leaflet/leaflayers.service'

// Experimental Components
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafmapComponent } from './leaflet/leafmap/leafmap.component';
//  import { ThreejsComponent } from './shared/threejs/threejs.component';
//  import { Arcgis3dMapComponent } from './shared/arcgis/arcgis-3d-map/arcgis-3d-map.component';

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
    MaterialModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyBKzKeYcswjXCTr0oww5CyaIn86t_VEaKw' }),
    NgxGraphsModule,
    SidebarsModule,
    LeafletModule.forRoot(),
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
    LeaflayersService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
