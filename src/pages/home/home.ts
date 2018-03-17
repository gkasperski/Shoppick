import { Component } from '@angular/core';
import { NavController, App, LoadingController, ToastController, AlertController } from 'ionic-angular';

import { FirebaseAuthProvider } from "../../providers/firebase-auth";

import { CreateListPage } from '../create-list/create-list';
import { ListPage } from '../list/list';
import { FirebaseDataProvider } from "../../providers/firebase-data";
 

/** Komponent strony glownej z listami zakuków
 * 
 * 
 * @export
 * @class HomePage
 */
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class HomePage {
    public isLoggedIn: boolean;
    public data: Array<any> = [];
    private uid: string;

    constructor(public navCtrl: NavController, private auth: FirebaseAuthProvider, private dataProvider: FirebaseDataProvider) {
        auth.af.auth.subscribe(data => {
            this.uid = data.uid;
        }); // pobiera dane z storage offline
        this.getLists();
    }

    /** Metoda pobiera id list, które posiada dany użytkownik oraz dane tych list z ich produktami
     * 
     * 
     * 
     * @memberOf HomePage
     */
    getLists() {
        this.dataProvider.list('/lists_users', {
            query: {
                orderByChild: this.uid,
                equalTo: true
            }
        }).subscribe(dataLists => {
            for (let i = 0; i < dataLists.length; i++) {
                this.dataProvider.list('lists/' + dataLists[i].$key).subscribe(dataList => {
                    this.data[i] = dataList;
                    this.data[i]['lid'] = dataLists[i].$key;

                    console.log(this.data);
                    
                });
            }
        });
    }

    /** Metoda wywołujaca widok list do podgladu
     * 
     * @param list 
     */
    viewList(products, listId, listName) {
        this.navCtrl.push(ListPage, {
            'products': products,
            'listId': listId,
            'userId': this.uid,
            'listName': listName
        });
    }

    /** Metoda dodajaca nowa liste wraz z produktami przypisanymi do niej
     * 
     * 
     * 
     * @memberOf HomePage
     */
    addList() {
        this.navCtrl.push(CreateListPage);
    }

    /** Metoda dodajaca liste do ulubionych
     * 
     * 
     * 
     * @memberOf HomePage
     */
    addToFavourites(list) {
        console.log(list);
    }
}