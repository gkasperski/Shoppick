import { Component } from '@angular/core';
import { LoadingController, ToastController, NavParams, NavController } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { FirebaseDataProvider } from '../../providers/firebase-data';
import { HomePage } from '../home/home';

/**
 * Komponent do przegladania listy produktów
 * 
 * @export
 * @class ListsPage
 */

@Component({
    selector: 'page-list',
    templateUrl: 'list.html',
})
export class ListPage {
    public products: any;
    public listId:   any;
    public userId:   any;
    public listName: any;

    constructor(public navCtrl: NavController, private dataProvider: FirebaseDataProvider, public NavParams: NavParams) {
        this.products = this.NavParams.get('products');
        this.listId   = this.NavParams.get('listId');
        this.userId   = this.NavParams.get('userId');
        this.listName = this.NavParams.get('listName');
        // console.log(this.products);
    }

    removeList(lid: number) {
        let userId = {};
        userId[this.userId] = false;
        this.dataProvider.update('lists_users/' + lid, userId);
        this.navCtrl.setRoot(HomePage);
        // console.log('lists_users/' + lid + '/' + this.userId);
    }
}