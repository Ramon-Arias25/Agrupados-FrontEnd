import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    providers: [UserService]
})
export class LoginComponent implements OnInit{
    public title:string;
    public user:User;
    public status: string;
    public identity;
    public token;

    constructor(
        private myRoute: ActivatedRoute,
        private myRouter: Router,
        private myUserServices: UserService
    ){
        this.title = 'SignIn';
        this.user = new User('',
        '',
        '',
        '',
        '',
        '',
        'ROLE_USER',
        '');
    }

    ngOnInit(){
        //console.log('Componente login cargado. . . ');
    }
    onSubmit(){
        // Loguear al usuario y conseguir sus datos
        this.myUserServices.signup(this.user).subscribe(
            response => {
                this.identity = response.user;
                //console.log(this.identity);
                if(!this.identity || !this.identity._id){
                    this.status = 'error';
                }else{
                    //PERSISTIR DATOS DEL USUARIO
                    localStorage.setItem('identity',JSON.stringify(this.identity));
                    //GET TOKEN
                    this.getToken();
                }
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);
                if(errorMessage != null){
                    this.status = 'error';
                }
            }
        );
    }
    getToken(){
        this.myUserServices.signup(this.user, 'true').subscribe(
            response => {
                this.token = response.token;
                if(this.token.length <= 0){
                    this.status = 'error';
                }else{
                    //PERSISTIR TOKEN DEL USUARIO
                    localStorage.setItem('token',JSON.stringify(this.token));
                    //GET COUNTS
                    this.getCounters();
                }
            },
            error =>{
                var errorMessage = <any>error;
                console.log(errorMessage);
                if(errorMessage != null){
                    this.status = 'error';
                }
            }
        );
    }

    getCounters(){
        this.myUserServices.getCounters(this.identity._id).subscribe(
            response => {
                localStorage.setItem('stats', JSON.stringify(response));
                this.status = 'success'
                this.myRouter.navigate(['/']);
            },
            error => {
                console.log(<any>error);
            }
        )
    }
}