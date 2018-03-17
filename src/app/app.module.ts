// Angular && Ionic modules
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

// Pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { CreateListPage } from '../pages/create-list/create-list';
import { SignupPage } from '../pages/signup/signup';
import { ListPage } from '../pages/list/list';

// Firebase
import { AngularFireModule } from 'angularfire2';

// Providers
import { FirebaseAuthProvider } from "../providers/firebase-auth";
import { FirebaseDataProvider } from "../providers/firebase-data";
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';

export const firebaseConfig = {
    apiKey: "AIzaSyAJ__9DaVyORJ6UMN4EXC84fGU5bv3NZUc",
    authDomain: "listy-zakupow-globallogic.firebaseapp.com",
    databaseURL: "https://listy-zakupow-globallogic.firebaseio.com",
    projectId: "listy-zakupow-globallogic",
    storageBucket: "listy-zakupow-globallogic.appspot.com",
    messagingSenderId: "863851088645"
};


@NgModule({
    declarations: [
        MyApp,
        HomePage,
        LoginPage,
        CreateListPage,
        SignupPage,
        ListPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp, {
            scrollAssist: false
        }),
        AngularFireModule.initializeApp(firebaseConfig)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        LoginPage,
        HomePage,
        CreateListPage,
        SignupPage,
        ListPage
    ],
    providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, FirebaseAuthProvider, FirebaseDataProvider, SplashScreen, StatusBar, GooglePlus, Facebook]
})

export class AppModule { }
