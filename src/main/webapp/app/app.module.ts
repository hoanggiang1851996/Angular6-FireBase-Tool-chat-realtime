import './vendor.ts';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { Ng2Webstorage } from 'ngx-webstorage';
import { NgJhipsterModule } from 'ng-jhipster';
import { environment } from 'app/core/config/config';

import { ToolChatSharedModule } from 'app/shared';
import { ToolChatCoreModule } from 'app/core';
import { ToolChatAppRoutingModule } from './app-routing.module';
import * as moment from 'moment';
import { AngularFireModule } from 'angularfire2';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { JhiMainComponent, NavbarComponent, FooterComponent, PageRibbonComponent, ActiveMenuDirective, ErrorComponent } from './layouts';
import { SigninModule } from 'app/modules/signin/signin.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardModule } from 'app/modules/dashboard/dashboard.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AuthInterceptor } from 'app/core/interceptor/auth.interceptor';
import { AuthService } from 'app/core/services/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, FirestoreSettingsToken } from 'angularfire2/firestore';

@NgModule({
    imports: [
        BrowserModule,
        SigninModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-' }),
        NgJhipsterModule.forRoot({
            // set below to true to make alerts look like toast
            alertAsToast: false,
            alertTimeout: 5000,
            i18nEnabled: true,
            defaultI18nLang: 'en'
        }),
        ToolChatSharedModule.forRoot(),
        ToolChatCoreModule,
        // jhipster-needle-angular-add-module JHipster will add new module here
        ToolChatAppRoutingModule,
        DashboardModule,
        SimpleNotificationsModule,
        BrowserAnimationsModule,
        AngularFireModule.initializeApp(environment.firebase)
    ],
    declarations: [JhiMainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, ActiveMenuDirective, FooterComponent],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        AuthService,
        AngularFireAuth,
        AngularFirestore,
        {
            provide: FirestoreSettingsToken,
            useValue: {}
        }
    ],
    bootstrap: [JhiMainComponent]
})
export class ToolChatAppModule {
    constructor(private dpConfig: NgbDatepickerConfig) {
        this.dpConfig.minDate = { year: moment().year() - 100, month: 1, day: 1 };
    }
}
