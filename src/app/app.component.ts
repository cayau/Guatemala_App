import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  
  isLoading = false;
  public user = {};

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar, 
    public navCtrl: NavController,    
    //public events: Events, 
    public ds: AppService,
  ) {
    this.initializeApp();
    /*events.subscribe('user:login', (user, time) => {
      this.user = user;
    });*/
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log("Platform ready");
      this.ds.getStorageUser().then( (userData) => {
        this.user = userData;
        if(userData && userData['id']){
            this.navCtrl.navigateRoot('');
        }else{
            this.navCtrl.navigateRoot('login');
        }
      });
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
