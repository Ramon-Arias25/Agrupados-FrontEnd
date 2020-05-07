import { Component, OnInit, DoCheck} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Message } from '../../../models/message';
import { Follow } from '../../../models/follow';
import { FollowService } from '../../../services/follow.service';
import { GLOBAL } from '../../../services/global';
import { MessageService } from '../../../services/message.service';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'sended',
    templateUrl: './sended.component.html',
    providers: [FollowService, MessageService]
})
export class SendedComponent implements OnInit{
    public title: string;
    public identity;
    public token;
    public url: string;
    public status: string;
    public messages: Message[];
    public pages;
    public page;
    public total: any;
    public prevPage;
    public nextPage;

    constructor(
        private myRoute: ActivatedRoute,
        private myRouter: Router,
        private myFollowService: FollowService,
        private myMessageService: MessageService,
        private myUserService: UserService
    ){
        this.title = 'Mensaje enviado';
        this.identity = this.myUserService.getIdentity();
        this.token = this.myUserService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('sended.component cargado. . .');
        this.actualPage();
    }

    getMessages(token, page){
        this.myMessageService.getOutbox(token,page).subscribe(
            response => {
                //console.log(response.messages);
                this.messages = response.messages;
                this.pages = response.pages;
                this.total = response.total;
            },
            error => {
                console.log(<any>error);
            }
        );
    }
    actualPage(){
        this.myRoute.params.subscribe(params => {
            let page = +params['page'];
            if(!page){
                page = 1;
            }
            this.page = page;
            this.nextPage = page + 1;
            this.prevPage = page - 1;
            if(this.prevPage <= 0){
                this.prevPage = 1;
            }
            //devolver listados usuarios
            this.getMessages(this.token, this.page);
        });
    }
}