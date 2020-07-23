import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { AppService } from '../app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  password_type: string = 'password';
  isLoading = false;

  constructor(
    public ds: AppService,
    public loadingController: LoadingController,    
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    //public events: Events,
  ) { }

  async login(form) {    
    if(form.valid){
      this.present_spinner(); 
      this.ds.loginUser(form.controls.correo.value, form.controls.password.value).subscribe((resLogin) => {
          this.dismiss_spinner();          
          let res = JSON.parse(resLogin['_body']);
          this.ds.setStorageUser(res['response']['data']);
          this.navCtrl.navigateRoot('/tabs');
          //this.events.publish('user:login', res['usuario'], Date.now());
      },
      err => {
          this.dismiss_spinner();
          this.presentAlert('Mensaje', 'Tus datos de ingreso son inválidos.', 'Aceptar');
      });
    } else {
      this.presentAlert('Error', 'Debes llenar todos los campos.', 'Aceptar');
    }
  }

  togglePasswordMode() {
    this.password_type = this.password_type === 'text' ? 'password' : 'text';
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

  ngOnInit() {
  }

}
