import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { FirebaseListFactoryOpts } from "angularfire2/interfaces";

/**
 * Klasa CRUD do Firebase
 * 
 * @export
 * @class FirebaseDataProvider
 */
@Injectable()
export class FirebaseDataProvider {
    constructor(private af: AngularFire) { }

    /**
     * Metoda CREATE wrzucająca dane do bazy.
     * 
     * @param {string} path - scieżka obiektów, gdzie wrzucic obiekt
     * @param {*} data - obiekt JSON
     * @returns {Observable<any>} 
     * 
     * @memberOf FirebaseDataProvider
     */
    push(path: string, data: any): Observable<any> {
        return Observable.create(observer => {
            this.af.database.list(path).push(data).then(firebaseNewData => {
                // Return the uid created
                let newData: any = firebaseNewData;
                observer.next(newData.path.o[newData.path.o.length - 1]);
            }, error => {
                observer.error(error);
            });
        });
    }

    /**
     * Metoda UPDATE - Aktualizuje obiekt podany w sciezce na nowy.
     * 
     * @param {string} path - scieżka
     * @param {*} data - obiekt JSON
     * 
     * @memberOf FirebaseDataProvider
     */
    update(path: string, data: any) {
        this.af.database.object(path).update(data);
    }

    /**
     * Pobiera dane listy
     * 
     * @param {string} path 
     * @returns {FirebaseListObservable<any>} 
     * 
     * @memberOf FirebaseDataProvider
     */
    list(path: string, opts? : FirebaseListFactoryOpts): FirebaseListObservable<any> {
        return this.af.database.list(path, opts);
    }

    /**
     * Pobiera dane obiektu
     * 
     * @param {string} path 
     * @returns {FirebaseObjectObservable<any>} 
     * 
     * @memberOf FirebaseDataProvider
     */
    object(path: string): FirebaseObjectObservable<any> {
        return this.af.database.object(path);
    }

    /**
     * Usuwa obiekt z bazy.
     * 
     * @param {string} path 
     * @returns {Observable<any>} 
     * 
     * @memberOf FirebaseDataProvider
     */
    remove(path: string): Observable<any> {
        return Observable.create(observer => {
            this.af.database.object(path).remove().then(data => {
                observer.next();
            }, error => {
                observer.error(error);
            });
        });
    }
}