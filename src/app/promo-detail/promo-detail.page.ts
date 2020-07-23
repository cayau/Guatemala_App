import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-promo-detail',
  templateUrl: './promo-detail.page.html',
  styleUrls: ['./promo-detail.page.scss'],
})
export class PromoDetailPage implements OnInit {
  public promo = []
  constructor(
    public ds: AppService,
    ) { }

  ngOnInit() {    
    this.ds.getStoragePromocionActual().then( (guiaData) => {
      this.promo = guiaData; 
    });
  }

}
