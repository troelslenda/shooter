import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'
import { tap, map, take} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class IsUnauthorizedGuard implements CanActivate {
  constructor (private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return !this.auth.isAuthenticated
  }
}