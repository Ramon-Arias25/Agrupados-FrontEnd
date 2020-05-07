 import { Component, OnInit } from '@angular/core';
 import { Router, ActivatedRoute, Params } from '@angular/router';
 import { Publication } from '../../models/publication';
 import { GLOBAL } from '../../services/global';
 import { UserService } from '../../services/user.service';
 import { PublicationService } from '../../services/publication.service';
 
 // import { $ } from "jquery";
 //import * as $ from 'jquery';
 declare var jQuery:any;
declare var $:any;
 


 @Component({
     selector: 'timeline',
     templateUrl: './timeline.component.html',
     providers: [UserService, PublicationService]
 })
 export class TimelineComponent implements OnInit{
    public title: string;
    public identity;
    public token;
    public url: string;
    public status: string;
    public page;
    public total;
    public pages;
    public itemsPerPage;
    public publications: Publication[];

    constructor(
        private myRoute: ActivatedRoute,
        private myRouter: Router,
        private myUserService: UserService,
        private myPublicationService: PublicationService
    ){
        this.title = 'Timeline';
        this.identity = this.myUserService.getIdentity();
        this.token = this.myUserService.getToken();
        this.url = GLOBAL.url;
        this.page = 1;
    }

    ngOnInit(){
        console.log('TimeLine Component is load!');
        this.getPublications(this.page);
    }

    getPublications(page, adding = false){
        this.myPublicationService.getPublication(this.token, page).subscribe(
            response => {
                //console.log(response);
                if(response.publications){
                    
                    this.total = response.total_items;
                    this.pages = response.pages;
                    this.itemsPerPage = response.itemsPerPage;

                    if(!adding){
                        this.publications = response.publications;
                    }else{
                        var arrayA = this.publications;
                        var arrayB = response.publications;
                        this.publications = arrayA.concat(arrayB);

                        $('html,body').animate({scrollTop: $('body').prop('scrollHeight')}, 1000);
                    }

                    if(page > this.pages){
                        //this.myRouter.navigate(['/home']);
                    }
                }else{
                    this.status = 'error';
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

    public noMore = false;
    viewMore(){
        //console.log(this.page);
        //console.log(this.pages);
        //if(this.publications.length == this.total){
        if(this.page  == this.pages){
            this.noMore = true;
        }else{
            this.page += 1;
            if(this.page >= this.pages){
                this.noMore = true;
            }
        }

        this.getPublications(this.page, true);
    }

    refresh(event = null){
        this.getPublications(1);
    }

    deletePublication(id){
        this.myPublicationService.deletePublication(this.token,id).subscribe(
            response => {
                this.refresh();
            },
            error => {
                console.log(<any>error);
            }
        );
    }
 }