import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad  {
  constructor(private authService: AuthService, private route: Router, private cookieService: CookieService) {}
  canLoad(route: Route, segments: UrlSegment[]): boolean | Promise<boolean> | Observable<boolean> {
    if (this.cookieService.get('isLoggedIn') === 'true') {
      return true;
    } else {
      this.route.navigate(['/auth']);
    }
  }

}
