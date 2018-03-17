import { Component } from '@angular/core';
import { NavController, App, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';

import { FirebaseAuthProvider } from '../../providers/firebase-auth';

/**
 * Komponent autoryzacji użytkowników.
 * 
 * @export
 * @class LoginPage
 */
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})

export class LoginPage {
    form: any;
    constructor(public navCtrl: NavController, private _auth: FirebaseAuthProvider,
        private _app: App, private loadingCtrl: LoadingController, private _toastCtrl: ToastController,
        private alertCtrl: AlertController) {
        this.form = {
            email: '',
            password: ''
        }
    }

    /**
     * Metoda uruchamiająca się przy wejściu na widok.
     * Ustawia tytuł obecnej strony.
     * 
     * @memberOf LoginPage
     */
    ionViewDidEnter() {
        this._app.setTitle("Shoppick - Autoryzacja");
    }

    /**
     * Logowanie się do aplikacji za pomocą adresu e-mail.
     * 
     * @param {string} email 
     * @param {string} password 
     * 
     * @memberOf LoginPage
     */
    signIn() {
        let loading = this.loadingCtrl.create({
            content: 'Proszę czekać...'
        });
        loading.present();

        this._auth.loginWithEmail(this.form).subscribe(data => {
            setTimeout(() => {
                loading.dismiss();
            }, 1000);
        }, err => {
            setTimeout(() => {
                loading.dismiss();
                this.showToast(err);
            }, 1000);
        });
    }

    /**
     * Metoda wyświetlająca wiadomość w dymku na ekranie.
     * 
     * @param message - wiadomość która się pokaże
     */
    showToast(message) {
        const toast = this._toastCtrl.create({
            message: message,
            position: 'bottom',
            duration: 3000
        });
        toast.present();
    }

    /**
     * Logowanie się do aplikacji za pomocą kont Google
     * Potrzebny poprawny, wygenerowany klucz SHA-1 ustawiony na stronie aplikacji, aby działało na urządzeniu Android.
     * 
     * @memberOf LoginPage
     */
    loginUserWithGoogle() {
        let loading = this.loadingCtrl.create({
            content: 'Proszę czekać...'
        });
        loading.present();

        this._auth.loginWithGoogle().subscribe(data => {
            setTimeout(() => {
                loading.dismiss();
            }, 1000);
        }, err => {
            setTimeout(() => {
                loading.dismiss();
                if (err = 2501) {
                    err = "Błąd: Wyłączono okno przed zakonczeniem logowania.";
                }
                this.showToast(err);
            }, 1000);
        });
    }

    /**
     * Logowanie się do aplikacji za pomocą kont Facebook.
     * Jeśli aplikacja jest w fazie developerskiej, możliwe, że logować się mogą tylko administratorzy aplikacji.
     * 
     * @memberOf LoginPage
     */
    loginUserWithFacebook() {
        let loading = this.loadingCtrl.create({
            content: 'Proszę czekać...'
        });
        loading.present();

        this._auth.loginWithFacebook().subscribe(data => {
            setTimeout(() => {
                loading.dismiss();
                // The auth subscribe method inside the app.ts will handle the page switch to home
            }, 1000);
        }, err => {
            setTimeout(() => {
                loading.dismiss();
                this.showToast(err);
            }, 1000);
        });
    }

    /**
     * Przejście do okna rejestracji nowego konta.
     * 
     * @memberOf LoginPage
     */
    signUp() {
        this.navCtrl.push(SignupPage);
    }

    /**
     * Odzyskiwanie hasła
     * 
     * @memberOf LoginPage
     */
    forgotPassword() {
        let alert = this.alertCtrl.create({
            title: 'Odzyskiwanie konta',
            inputs: [
                {
                    name: 'email',
                    placeholder: 'Podaj adres e-mail'
                }
            ],
            buttons: [
                {
                    text: 'Anuluj',
                    role: 'cancel'
                },
                {
                    text: 'Wyślij link do zmiany hasła',
                    handler: data => {
                        let loading = this.loadingCtrl.create({
                            content: 'Proszę czekać...'
                        });
                        loading.present();
                        this._auth.sendPasswordResetEmail(data.email).subscribe(data => {
                            this.showToast("Wkrótce otrzymasz wiadomość e-mail z linkiem do zmiany hasła.")
                            loading.dismiss();
                        }, error => {
                            this.showToast(error);
                            loading.dismiss();
                        })
                    }
                }
            ]
        });
        alert.present();
    }
}