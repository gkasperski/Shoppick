import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase';

// Providers
import { FirebaseDataProvider } from './firebase-data';

/**
 * Uslugi uwierzytelniania uzytkowników. E-mail login, Google login, Facebook login.
 * Zapisywanie użytkowników do Firebase
 * 
 * @export
 * @class FirebaseAuthProvider
 */
@Injectable()
export class FirebaseAuthProvider {
    constructor(public af: AngularFire, private data: FirebaseDataProvider, private platform: Platform, private googlePlus: GooglePlus, private facebook: Facebook) { }

    /**
     * Metoda zwraca dane o zalogowanym użytkowniku.
     * 
     * @returns {Observable}
     * 
     * @memberOf FirebaseAuthProvider
     */
    getUserData() {
        return Observable.create(observer => {
            this.af.auth.subscribe(authData => {
                if (authData) {
                    this.data.object('users/' + authData.uid).subscribe(userData => {
                        observer.next(userData);
                    });
                } else {
                    observer.error();
                }
            });
        });
    }
    /**
     * Metoda rejestruje użytkowników do bazy danych a następnie ich loguje.
     * 
     * @param {*} credentials 
     * @returns {Observable}
     * 
     * @memberOf FirebaseAuthProvider
     */
    registerUser(credentials: any) {
        return Observable.create(observer => {
            this.af.auth.createUser(credentials).then((authData: any) => {
                console.log(authData);
                this.af.database.list('users').update(authData.uid, {
                    email: authData.auth.email,
                    provider: 'email'
                });
                credentials.created = true;

                observer.next(credentials);
            }).catch((error: any) => {
                if (error) {
                    switch (error.code) {
                        case 'auth/invalid-email':
                            observer.error('Błąd: Niepoprawny adres e-mail');
                            break;
                        case 'auth/email-already-in-use':
                            observer.error('Błąd: Ten adres e-mail jest już zajęty.');
                            break;
                        case 'auth/weak-password':
                            observer.error('Błąd: Hasło musi się składać z minimum 6 znaków.');
                            break;
                        case 'auth/operation-not-allowed':
                            observer.error('Błąd: Konta e-mail są wyłączone. Zaloguj się przez Google lub Facebook\'a.');
                        default:
                            observer.error(error);
                    }
                }
            });
        });
    }

    /**
     * Metoda loguje za pomocą adresu e-mail.
     * 
     * @param {any} credentials - dane z formularza email + password
     * @returns {Observable}
     * 
     * @memberOf FirebaseAuthProvider
     */
    loginWithEmail(credentials) {
        return Observable.create(observer => {
            this.af.auth.login(credentials, {
                provider: AuthProviders.Password,
                method: AuthMethods.Password
            }).then((authData) => {
                console.log(authData);
                observer.next(authData);
            }).catch((error: any) => {
                if (error) {
                    console.log(error);
                    switch (error.code) {
                        case 'auth/invalid-email':
                            observer.error('Błąd: Niepoprawny adres e-mail');
                            break;
                        case 'auth/operation-not-allowed':
                            observer.error('Błąd: Konta e-mail są wyłączone. Zaloguj się przez Google lub Facebook\'a.');
                            break;
                        case 'auth/wrong-password':
                            observer.error('Błąd: Nieprawidłowy login i/lub hasło.');
                            break;
                        case 'auth/network-request-failed':
                            observer.error('Błąd sieci. Spróbuj ponownie.');
                            break;
                        case 'auth/user-not-found':
                            observer.error('Błąd: Podane konto nie istnieje.');
                            break;
                        case 'auth/too-many-requests':
                            observer.error('Błąd: Zablokowano wszystkie żądania z tego urządzenia z powodu nienormalnej aktywności. Spróbuj później.')
                        default:
                            observer.error(error);
                    }
                }
            });
        });
    }

    /**
     * Metoda loguje i rejestruje użytkowników za pomocą modułu natywnego Facebook lub modułu sieciowego oraz aktualizuje dane w bazie o użytkowniku.
     * 
     * @returns {Observable<any>} 
     * 
     * @memberOf FirebaseAuthProvider
     */
    loginWithFacebook(): Observable<any> {
        return Observable.create(observer => {
            if (this.platform.is('cordova')) {
                // Logowanie przez aplikację urządzenia mobilnego
                this.facebook.login(['public_profile', 'email']).then(facebookData => {
                    let provider = firebase.auth.FacebookAuthProvider.credential(facebookData.authResponse.accessToken);
                    firebase.auth().signInWithCredential(provider).then(firebaseData => {
                        console.log(firebaseData);
                        this.af.database.list('users').update(firebaseData.uid, {
                            name: firebaseData.providerData[0].displayName,
                            email: firebaseData.providerData[0].email,
                            provider: firebaseData.providerData[0].providerId,
                            image: firebaseData.providerData[0].photoURL
                        });
                        observer.next();
                    });
                }, error => {
                    if (error) {
                        console.log(error);
                        switch (error.errorCode) {
                            case "4201":
                                observer.error('Błąd: Wyłączono okno przed zakonczeniem logowania.');
                                break;
                            default:
                                observer.error(error);
                        }
                    }
                });
            } else {
                // Logowanie przez przeglądarke internetową
                this.af.auth.login({
                    provider: AuthProviders.Facebook,
                    method: AuthMethods.Popup
                }).then((facebookData) => {
                    console.log(facebookData);
                    this.af.database.list('users').update(facebookData.auth.uid, {
                        name: facebookData.auth.providerData[0].displayName,
                        email: facebookData.auth.providerData[0].email,
                        provider: facebookData.auth.providerData[0].providerId,
                        image: facebookData.auth.providerData[0].photoURL
                    });
                    observer.next();
                }).catch((error: any) => {
                    console.info("error", error);
                    if (error) {
                        switch (error.code) {
                            case 'auth/popup-closed-by-user':
                                observer.error('Błąd: Wyłączono okno przed zakonczeniem logowania.');
                                break;
                            default:
                                observer.error(error);
                        }
                    }
                });
            }
        });
    }

    /**
     * Metoda loguje i rejestruje użytkownika za pomocą modułu Google+ lub modułu webowego google. Zapisuje użytkownika do Firebase.
     * 
     * @returns {Observable<any>} 
     * 
     * @memberOf FirebaseAuthProvider
     */
    loginWithGoogle(): Observable<any> {
        return Observable.create(observer => {
            if (this.platform.is('cordova')) {
                // Logowanie przez aplikację urządzenia mobilnego
                this.googlePlus.login({
                    'webClientId': '863851088645-bflctn3u4nqe3tiu80tn16okrm43mdfv.apps.googleusercontent.com',
                    'offline': true
                }).then((googleData) => {
                    let provider = firebase.auth.GoogleAuthProvider.credential(googleData.idToken);
                    firebase.auth().signInWithCredential(provider).then((firebaseData) => {
                        this.af.database.list('users').update(firebaseData.uid, {
                            name: firebaseData.providerData[0].displayName,
                            email: firebaseData.providerData[0].email,
                            provider: firebaseData.providerData[0].providerId,
                            image: firebaseData.providerData[0].photoURL
                        });
                        observer.next();
                    }).catch((error: any) => {
                        console.error(error);
                        switch (error.code) {
                            case ('auth/network-request-failed'):
                                observer.error('Błąd sieci. Spróbuj ponownie');
                                break;
                            default: observer.error(error);
                        }
                    });
                }, error => {
                    observer.error(error);
                }).catch((data) => {
                    console.log(data);
                });
            } else {
                // Logowanie przez przeglądarke internetową
                this.af.auth.login({
                    provider: AuthProviders.Google,
                    method: AuthMethods.Popup
                }).then((googleData) => {
                    this.af.database.list('users').update(googleData.auth.uid, {
                        name: googleData.auth.providerData[0].displayName,
                        email: googleData.auth.providerData[0].email,
                        provider: googleData.auth.providerData[0].providerId,
                        image: googleData.auth.providerData[0].photoURL
                    });
                    observer.next();
                }).catch((error: any) => {
                    if (error) {
                        switch (error.code) {
                            case 'auth/popup-closed-by-user':
                                observer.error('Błąd: Wyłączono okno przed zakonczeniem logowania.');
                                break;
                            default:
                                observer.error(error);
                        }
                    }
                });
            }
        });
    }

    /**
     * Metoda wysyła na e-mail link do zmiany hasła dla podanego konta.
     * 
     * @param {any} email 
     * @returns {Observable}
     * 
     * @memberOf FirebaseAuthProvider
     */
    sendPasswordResetEmail(email) {
        return Observable.create(observer => {
            firebase.auth().sendPasswordResetEmail(email).then(function () {
                observer.next();
            }).catch((error: any) => {
                console.log(error);
                if (error) {
                    switch (error.code) {
                        case 'auth/invalid-email':
                            observer.error('Błąd: Niepoprawny adres e-mail');
                            break;
                        case 'auth/email-already-in-use':
                            observer.error('Błąd: Ten adres e-mail jest już zajęty.');
                            break;
                        case 'auth/weak-password':
                            observer.error('Błąd: Hasło musi się składać z minimum 6 znaków.');
                            break;
                        case 'auth/operation-not-allowed':
                            observer.error('Błąd: Konta e-mail są wyłączone. Zaloguj się przez Google lub Facebook\'a.');
                            break;
                        case 'auth/user-not-found':
                            observer.error('Błąd: Podane konto nie istnieje.');
                            break;
                        default:
                            observer.error(error);
                    }
                }
                observer.error(error);
                // An error happened.
            });
        });
    }

    /**
     * Metoda wylogowuje użytkownika.
     * 
     * 
     * @memberOf FirebaseAuthProvider
     */
    logout() {
        this.af.auth.logout();
    }
}