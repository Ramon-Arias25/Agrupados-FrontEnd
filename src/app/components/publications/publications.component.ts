 import { Component, OnInit, Input } from '@angular/core';
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
     selector: 'publications',
     templateUrl: './publications.component.html',
     providers: [UserService, PublicationService]
 }) 
 export class PublicationsComponent implements OnInit{
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
    public noMore = false;
    @Input() userId: string;

    constructor(
        private myRoute: ActivatedRoute,
        private myRouter: Router,
        private myUserService: UserService,
        private myPublicationService: PublicationService
    ){
        this.title = 'publications';
        this.identity = this.myUserService.getIdentity();
        this.token = this.myUserService.getToken();
        this.url = GLOBAL.url;
        this.page = 1;
    }

    ngOnInit(){
        console.log('publications Component is load!');
        this.getPublicationsByUser(this.userId,this.page);
    }

    getPublicationsByUser(userId, page, adding = false){
        this.myPublicationService.getPublicationByUser(this.token,userId, page).subscribe(
            response => {
                //console.log(response);
                if(response.publications){
                    this.total = response.total_items;
                    this.pages = response.pages;
                    this.itemsPerPage = response.itemsPerPage;
                    if(response.publications.length > 0){
                        this.noMore=false;
                    }else{
                        this.noMore=true;
                    }
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

        this.getPublicationsByUser(this.userId, this.page, true);
    }
 }