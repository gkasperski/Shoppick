import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';

import { FirebaseAuthProvider } from '../providers/firebase-auth';
import { FirebaseDataProvider } from '../providers/firebase-data';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage: any;

    constructor(private platform: Platform, protected auth: FirebaseAuthProvider, protected data: FirebaseDataProvider, protected splashScreen: SplashScreen,
        protected statusBar: StatusBar) {
        this.platform.ready().then(() => {
            this.auth.af.auth.subscribe(
                (auth) => {
                    if (auth == null) {
                        this.rootPage = LoginPage;
                        this.splashScreen.hide();
                    }
                    else {
                        this.rootPage = HomePage;
                        this.splashScreen.hide();
                    }
                }

            );
            this.statusBar.styleDefault();
        });
    }
}
