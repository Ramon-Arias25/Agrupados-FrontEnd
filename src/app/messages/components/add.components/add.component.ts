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
    selector: 'add',
    templateUrl: './add.component.html',
    providers: [FollowService, MessageService]
})
export class AddComponent implements OnInit{
    public title: string;
    public message: Message;
    public identity;
    public token;
    public url: string;
    public status: string;
    public follows;

    constructor(
        private myRoute: ActivatedRoute,
        private myRouter: Router,
        private myFollowService: FollowService,
        private myMessageService: MessageService,
        private myUserService: UserService
    ){
        this.title = 'Enviar Mensaje';
        this.identity = this.myUserService.getIdentity();
        this.token = this.myUserService.getToken();
        this.url = GLOBAL.url;
        this.message = new Message(
            '',//id
            '',//text
            '',//wiewed
            '',//created_at
            this.identity._id,//emitter
            '');//reciver
    }

    ngOnInit(){
        console.log('add.component cargado. . .');
        this.getMyFollows();
    }

    getMyFollows(){
        this.myFollowService.getMyFollows(this.token).subscribe(
            response => {
                this.follows = response.follows;
            },
            error => {
                console.log(<any>error);
            }
        );
    }

    onSubmit(form){
        this.myMessageService.addMessage(this.token, this.message).subscribe(
            response => {
                if(response.message){
                    this.status = 'success';
                    form.reset();
                }
            },
            error => {
                this.status = 'error';
                console.log(<any>error);
            }
        );
    }
}