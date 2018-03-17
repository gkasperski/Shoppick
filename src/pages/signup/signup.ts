import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { FirebaseAuthProvider } from '../../providers/firebase-auth';
import { HomePage } from '../home/home';

/**
 * Komponent rejestracji użytkowników
 * 
 * @export
 * @class SignupPage
 */
@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})

export class SignupPage {
    form: any;
    constructor(public navCtrl: NavController, private _auth: FirebaseAuthProvider, private _loadingCtrl: LoadingController, private _toastCtrl: ToastController) {
        this.form = {
            email: '',
            password: '',
            repeatPassword: ''
        }
    }

    /**
     * Metoda zbiera dane z formularza i rejestruje użytkownika, a następnie go loguje.
     * 
     * 
     * @memberOf SignupPage
     */
    signUp() {
        let loading = this._loadingCtrl.create({
            content: 'Proszę czekać...'
        });
        loading.present();
        this._auth.registerUser(this.form).subscribe(registerData => {
            this._auth.loginWithEmail(registerData).subscribe(loginData => {
                setTimeout(() => {
                    loading.dismiss();
                    this.navCtrl.setRoot(HomePage);
                }, 1000);
            }, loginError => {
                setTimeout(() => {
                    loading.dismiss();
                    this.showToastWithCloseButton(loginError);
                }, 1000);
            });
        }, registerError => {
            setTimeout(() => {
                loading.dismiss();
                this.showToastWithCloseButton(registerError);
            }, 1000);
        });
    }

    /**
     * Wyświetla wiadomość w chmurce do zamknięcia przyciskiem.
     * 
     * @param {any} message 
     * 
     * @memberOf SignupPage
     */
    showToastWithCloseButton(message) {
        const toast = this._toastCtrl.create({
            message: message,
            showCloseButton: true,
            closeButtonText: 'Ok',
            position: 'bottom'
        });
        toast.present();
    }
}