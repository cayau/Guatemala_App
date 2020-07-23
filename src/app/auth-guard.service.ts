import { Injectable } from '@angular/core';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    public ds: AppService,
  ) { }

  canActivate(): boolean {
    return this.ds.isAuthenticated();
  }
}
