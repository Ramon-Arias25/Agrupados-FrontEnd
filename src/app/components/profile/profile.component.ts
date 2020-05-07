 import { Component, OnInit } from '@angular/core';
 import { Router, ActivatedRoute, Params } from '@angular/router';
 import { User } from '../../models/user';
 import { Follow } from '../../models/follow';
 import { UserService } from '../../services/user.service';
 import { FollowService } from '../../services/follow.service';
 import { GLOBAL } from '../../services/global';

 @Component({
     selector: 'profile',
     templateUrl: './profile.component.html',
     providers: [UserService, FollowService]
 })
export class ProfileComponent implements OnInit{
    public title: string;
    public user: User;
    public status: string;
    public identity;
    public token;
    public stats;
    public url;
    public followers;
    public following;

    constructor(
        private myRoute: ActivatedRoute,
        private myRouter: Router,
        private myUserService: UserService,
        private myFollowService: FollowService
    ){
        this.title= 'Perfil';
        this.identity = this.myUserService.getIdentity();
        this.token = this.myUserService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        this.loadPage();
        console.log('profile.component is load!');
    }

    loadPage(){
        this.myRoute.params.subscribe(params => {
            let id = params ['id'];
            this.getUser(id);
            this.getConters(id);
        });
    }

    getUser(id){
        this.myUserService.getUser(id).subscribe(
            response => {
                if(response){
                    //console.log(response);
                    //console.log(this.identity);
                    this.user = response.user;
                    this.followers = response.followers.includes( this.identity._id );
                    //console.log('lo sigo ' + this.followers );

                    this.following = response.following.includes( this.identity._id ); 
                    //console.log('me sigue ' + this.followers );

                }else{
                    this.status = 'error';
                }
            },
            error => {
                console.log(<any>error);
                this.myRouter.navigate(['/profile/',this.identity._id]);
            }
        );
    }

    getConters(id){
        this.myUserService.getCounters(id).subscribe(
            response => {
                //console.log(response);
                this.stats = response;
            },
            error => {
                console.log(<any>error);
            }
        )
    }

    followUser(followed){
        //var follow = new Follow('',this.identity._id,followed);
        this.myFollowService.addFollow(this.token,followed,this.identity._id).subscribe(
            response => {
                this.followers = true;
            },
            error => {
                console.log(<any>error);
            }
        );
    }

    unFollowUser(followed){
        this.myFollowService.deleteFollow(this.token,followed).subscribe(
            response => {
                this.followers = false;
            },
            error => {
                console.log(<any>error);
            }
        );
    }
    public followUserOver;
    mouseEnter(userId){
        this.followUserOver = userId;
    }

    mouseLeave(){
        this.followUserOver = 0;
    }

 }