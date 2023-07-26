import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import {inject} from '@angular/core';
import { of, tap, catchError } from 'rxjs';

export const authGuard = (next:ActivatedRouteSnapshot)=>{    
    const router = inject(Router);
    const authService = inject(AuthService);
    
    const token = authService.getTokenFromLocalStorage();    

    var nextPath = next.pathFromRoot.map(v => v.url.map(segment => segment.toString()).join('/')).join('/')    
    if (!token) {
        console.log("Token not exists, redirecting to login page");
        
        authService.setNextPath(nextPath);
        router.navigate(['/login']); // Redirect to login page if token is not present
        return of(false);
    };

    try {
        return authService.validateToken({token}).pipe(tap((isValid)=>{
            if(!isValid){
                console.log("Token not valid, redirecting to login page");
                authService.setNextPath(nextPath);
                return router.navigate(['/login']);
            }

            console.log("Token is valid, authprozing access to path");
            return true;
        }),
        catchError((error)=>{
            console.log("Error validating token, redirecting to login page. Error: ", error);
            authService.setNextPath(nextPath);
            return router.navigate(['/login']);

        }));        
      } catch (error) {
        console.log("Error validating token, redireting to login page");
        authService.setNextPath(nextPath);
        return router.navigate(['/login']);
      }
}
