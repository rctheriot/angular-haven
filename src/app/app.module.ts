import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http'
import { NgModule } from '@angular/core';
import { routes } from './app.routes';

// Firebase Stuff
import * as firebase from 'firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore'
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from './auth.service'
import { AuthGuard } from './auth-guard.service';
import { environment } from '../environments/environment';

// Haven Modules
import { HavenAppsModule } from './haven-apps/haven-apps.module';
import { HavenSidebarsModule } from './haven-sidebars/haven-sidebars.module';
import { HavenWindowModule } from './haven-window/haven-window.module';
import { HavenSharedModule } from './haven-shared/haven-shared.module';

// Haven Components
import { AppComponent } from './app.component';
import { HavenHeaderComponent } from './haven-header/haven-header.component';
import { HavenFooterComponent } from './haven-footer/haven-footer.component';
import { HavenLoginComponent } from './haven-login/haven-login.component';
import { HavenMainComponent } from './haven-main/haven-main.component';
import { HavenHomeComponent } from './haven-home/haven-home.component';

// Haven Services
import { HavenFirestoreQueryService } from './haven-shared/haven-services/haven-firestore-query.service'
import { HavenDatabaseQueryService } from './haven-shared/haven-services/haven-database-query.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    routes,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    HavenAppsModule,
    HavenSharedModule,
    HavenSidebarsModule,
    HavenWindowModule,
  ],
  declarations: [
    AppComponent,
    HavenHeaderComponent,
    HavenFooterComponent,
    HavenLoginComponent,
    HavenMainComponent,
    HavenHomeComponent,
  ],
  providers: [
    AuthService,
    AuthGuard,
    HavenDatabaseQueryService,
    HavenFirestoreQueryService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
