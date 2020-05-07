import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
    selector: 'following',
    templateUrl: './following.component.html',
    providers: [UserService, FollowService]
})
export class FollowingComponent implements OnInit{
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
    public following;
    public userIdUrl;
    public meSigue;
    public loSigo;
    
    public url: string;

    constructor(
        private myRoute: ActivatedRoute,
        private myRouter: Router,
        private myUserService: UserService,
        private myFollowService: FollowService
    ){
        this.title = 'Following';
        this.identity = this.myUserService.getIdentity();
        this.token = this.myUserService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('following.component is load!!');
        this.actualPage();
    }

    actualPage(){
        this.myRoute.params.subscribe(params => {
            this.userIdUrl = params['id'];
            let userId = params['id'];
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
            this.getUser(userId, page);
        });
    }

    getFollows(userId, page){
        this.myFollowService.getFollowing(this.token,userId,page).subscribe(
            response =>{
                if(!response){
                    this.status = 'error';
                    //console.log('no hay response');
                }else{
                    //console.log('esta es la response');
                    //console.log(response);
                    this.total = response.total;
                    this.follows = response.follows;
                    this.pages = response.pages;   
                    this.following = response.following;


                    
                    //console.log(this.total);
                    //console.log(this.following);
                    //console.log(this.pages);
                    if(page > this.pages){
                        //this.myRouter.navigate(['/people',1]);
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
    public user: User;
    getUser(userId, page){
        this.myUserService.getUser(userId).subscribe(
            response => {
                if(response.user){
                    this.user = response.user;
                    this.getFollows(userId, page);
                }else{
                    this.myRouter.navigate(['/home']);
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
                    this.following.push(followed);
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
                var search = this.following.indexOf(followed);
                if(search != -1){
                    this.following.splice(search,1);
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