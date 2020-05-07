import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    providers: [UserService, FollowService]
})
export class UsersComponent implements OnInit{
    public title: String;
    public identity;
    public token;
    public page;
    public nextPage;
    public prevPage;
    public total;
    public pages;
    public users: User[];
    public status;
    public follows;
    
    public url: string;

    constructor(
        private myRoute: ActivatedRoute,
        private myRouter: Router,
        private myUserService: UserService,
        private myFollowService: FollowService
    ){
        this.title = 'People';
        this.identity = this.myUserService.getIdentity();
        this.token = this.myUserService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('users.component is load!!');
        this.actualPage();
    }

    actualPage(){
        this.myRoute.params.subscribe(params => {
            let page = +params['page'];
            this.page = page;

            if(!page){
                page = 1;
            }
            this.nextPage = page + 1;
            this.prevPage = page - 1;

            if(this.prevPage <= 0){
                this.prevPage = 1;
            }
            //devolver listados usuarios
            this.getUsers(page);
        });
    }

    getUsers(page){
        this.myUserService.getUsers(page).subscribe(
            response =>{
                if(!response.users){
                    this.status = 'error';
                }else{
                    this.total = response.total;
                    this.users = response.users;
                    this.pages = response.pages;
                    this.follows = response.following;
                    
                    //console.log(this.follows);
                    if(page > this.pages){
                        this.myRouter.navigate(['/people',1]);
                    }
                }
        },
            error => {
                var errorMassege =<any>error;
                console.log(errorMassege);
                if(errorMassege != null){
                    this.status = 'error';
                }
            }
        );
    }

    public followUserOver;
    mouseEnter(user_id){
        this.followUserOver = user_id;
    }

    mouseLeave(user_id){
        this.followUserOver = 0;
    }

    followUser(followed){
        var follow = new Follow('',this.identity._id,followed);
        
        
        this.myFollowService.addFollow(this.token,followed,follow).subscribe(
            response => {
                if(!response.follow){
                    this.status = 'error';
                }else{
                    this.status = 'success';
                    this.follows.push(followed);
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

    unFolloUser(followed){
        this.myFollowService.deleteFollow(this.token,followed).subscribe(
            response =>{
                var search = this.follows.indexOf(followed);
                if(search != -1){
                    this.follows.splice(search,1);
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

}