import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class UserGuard implements CanActivate{
    constructor(
        private myRouter: Router,
        private myUserService: UserService
    ){}

    canActivate(){
        let identity = this.myUserService.getIdentity();

        if (identity && (identity.role == 'ROLE_USER' || identity.role == 'ROLE_ADMIN')){
            return true;
        }else{
            this.myRouter.navigate(['/login']);
            return false;
        }
    }
}