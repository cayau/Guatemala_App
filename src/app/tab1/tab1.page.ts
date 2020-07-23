import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { AppService } from '../app.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  isLoading = false;
  per_page = 10;
  current_page = 1;
  public promociones = [];
  public moreresults = false;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public ds: AppService,
  ) {}


  ngOnInit() {
    this.ds.getStorageUser().then( (userData) => {
      this.ds.promotionsList(this.per_page, this.current_page, userData).subscribe((resBus) => {
        this.dismiss_spinner();
        var res = JSON.parse(resBus['_body']);
        this.promociones = res['response']['data']['promotions'];
        this.moreresults = res['response']['data']['has_more_pages'];
      },
      err => {
          this.dismiss_spinner();
          this.promociones = [];
          this.presentAlert('Mensaje', 'Error al consultar promociones.', 'Aceptar');
          console.log("Error ",err);
      });
    });
  }

  verDetalle(guia){    
    setTimeout( () => {
      this.ds.setStoragePromocionActual(guia);
      this.navCtrl.navigateForward('/promo-detail');
    }, 200);
  }

  doInfinite(infiniteScroll) {
    if(this.moreresults){      
      this.ds.getStorageUser().then( (userData) => {
        this.current_page++;
        this.ds.promotionsList(this.per_page, this.current_page, userData).subscribe((resBus) => {
            infiniteScroll.target.complete();
            var d = JSON.parse(resBus['_body']);            
            this.moreresults = d['response']['data']['has_more_pages'];
            d = d['response']['data']['promotions'];  console.log("More data ",d);
            if(d.length > 0){
                for(var i=0 ; i < d.length ; i++){
                    this.promociones.push(d[i]);
                }                
            }else{
              this.presentAlert('Mensaje', 'Error al consultar promociones.', 'Aceptar');
            }
        },
        err => {
            infiniteScroll.target.complete();
            this.presentAlert('Mensaje', 'Error al consultar promociones.', 'Aceptar');
        });
      });
    }else{
        infiniteScroll.target.complete();
    }
  }

  async presentAlert(tit, sms, btn) {
    const alert = await this.alertCtrl.create({
        header: tit,
        message: sms,
        buttons: [btn]
    });
    await alert.present();
  }
  async dismiss_spinner() {    
    this.isLoading = false;    
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }
  async present_spinner() {
    this.isLoading = true;
    return await this.loadingController.create({
        message: 'Cargando',
        spinner: 'dots'
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

}
