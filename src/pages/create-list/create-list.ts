import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
// import { CommonModule } from '@angular/common';
import { FirebaseDataProvider } from '../../providers/firebase-data';
import { HomePage } from '../home/home';
import { FirebaseAuthProvider } from "../../providers/firebase-auth";

/**
 * Komponent tworzenia list z produktami
 * 
 * @export
 * @class CreateListPage
 */
@Component({
    selector: 'page-createList',
    templateUrl: 'create-list.html'
})

export class CreateListPage {
    newList: any;
    product: {};

    constructor(public navCtrl: NavController, private data: FirebaseDataProvider, private _loadingCtrl: LoadingController, private _toastCtrl: ToastController, private auth: FirebaseAuthProvider) {
        this.product = {
            "name": "",
            "quantity": ""
        };
        this.newList = {
            listName: "",
            products: [JSON.parse(JSON.stringify(this.product))]
        };
    };

    /** Medota dodajaca nowy produkt
     * 
     * 
     * 
     * @memberOf ProductsPage
     */
    addNewProduct() {
        this.newList.products.push(JSON.parse(JSON.stringify(this.product)));
    }

    /** Metoda tworzaca nowa liste z produktami
     * 
     * 
     * 
     * @memberOf ProductsPage
     */
    createNewList() {
        let loading = this._loadingCtrl.create({
            content: 'Proszę czekać...'
        });
        loading.present();

        this.data.push('lists', this.newList).subscribe(listKey => {
            this.auth.af.auth.subscribe(user => {
                let userList = {};
                userList[user.uid] = true;
                this.data.update('lists_users/' + listKey, userList);
                loading.dismiss();
                this.showToast("Lista została utworzona");
            }, err => {
                loading.dismiss();
                this.showToast(err);
            });
        }, err => {
            loading.dismiss();
            this.showToast(err);
        });
        this.navCtrl.setRoot(HomePage);
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

}