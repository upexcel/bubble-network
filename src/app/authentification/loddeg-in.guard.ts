import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { take, map } from 'rxjs/operators';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}


  canActivate() {
    return this.afAuth.authState.pipe(
      take(1),
      map(authState => {
        const authenticated = !!authState;
        if (authenticated) {
        } else {
          this.router.navigate(['welcome'])
        }
        return authenticated;
      })
    );
  }

}
