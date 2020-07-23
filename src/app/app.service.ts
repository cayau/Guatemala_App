import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Platform } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

/**
 * Constantas for the app services
 */
const path = 'http://guatemala-api.com';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  authState = new BehaviorSubject(false);
  constructor(public http: Http, public storage: Storage, private platform: Platform,) { 
    this.platform.ready().then(() => {
        this.ifLoggedIn();
    });
  }

  loginUser(usuario, password){    
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    const options = new RequestOptions({ headers: headers });
    const registerRequest = {
        'email': usuario,
        'password': password
    };
    const url = `${path}/api/login`;
    const registerResponse = this.http.post(url, registerRequest, options).pipe(
        map(res => res)
    );
    return registerResponse;
  }

  promotionsList(per_page, current_page, userData){
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');    
      headers.append('Authorization', 'Bearer '+userData['token']);
      const options = new RequestOptions({ headers: headers });
      const registerRequest = {
          'per_page': per_page,
          'current_page': current_page
      };
      const url = `${path}/api/get-promotions`;
      const registerResponse = this.http.post(url, registerRequest, options).pipe(
          map(res => res)
      );
      return registerResponse;
  }

  async promotionById(promotion_id, userData) {   
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      headers.append('Authorization', 'Bearer '+userData['token']);
      const options = new RequestOptions({ headers: headers });
      const registerRequest = {
          'promotion_id': promotion_id
      };
      const url = `${path}/api/get-promotion-by-id`;
      const registerResponse = this.http.post(url, registerRequest, options).pipe(
          map(res => res)
      );
      return registerResponse;
  }

  /** STORAGE */
  setStorageUser(user){
    this.storage.set('user', user);
    if(user['id']){
        this.authState.next(true);
    }else{
        this.authState.next(false);
    }
  }
  getStorageUser(){
      return this.storage.get('user')
          .then(res => {
              if(!res){
                  res = [];
              }
              return res;
          });
  }
  setStoragePromocionActual(promo){
    this.storage.set('promoAct', promo);
  }
  getStoragePromocionActual(){
    return this.storage.get('promoAct')
        .then(res => {
            return res;
        });
  }
  ifLoggedIn() {
    this.storage.get('user').then((response) => {
        if (response && response['id']) {
            this.authState.next(true);
        }else{
            this.authState.next(false);
        }
    });
  }
  
  isAuthenticated(){
    return this.authState.value;
  }
}
