import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';


@Component({
    selector: 'user-edit',
    templateUrl: './user.edit.component.html',
    providers: [UserService, UploadService]
})
export class UserEditComponent implements OnInit{
    public title: string;
    public user: User;
    public identity;
    public token;
    public status: string;
    public url: string;

    constructor(
        private myRoute: ActivatedRoute,
        private myRouter: Router,
        private myUserService: UserService,
        private myUploadService: UploadService
    ){
        this.title = 'Update Profile';
        this.user = this.myUserService.getIdentity();
        this.identity = this.user;
        this.token = this.myUserService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        
        console.log('user.edit.component is load!!');
        //console.log(this.user);
    }
    onSubmit(){
        //console.log(this.user);
        this.myUserService.updateUser(this.user).subscribe(
            response => {
                if(!response.user){
                    this.status = 'error';
                }else {
                    this.status = 'sucess';
                    localStorage.setItem('identity',JSON.stringify(this.user));
                    this.identity = this.user;
                    //subida de imagen de usuario
                    this.myUploadService.makeFileRequest(this.url+'upload/user/image/'+this.user._id, [], this.fileToUpload,this.token,'image')
                                        .then((result:any)=>{
                                            //console.log(result);
                                            this.user.image = result.user.image;
                                            localStorage.setItem('usuario',JSON.stringify(this.user));
                                        })
                                        .catch(error => {
                                            this.status = 'error';
                                            console.log(error);
                                        });
                }
            },
            error => {
                var errorMessage = <any>error;
                //console.log(errorMessage);
                if(errorMessage != null){
                    this.status = 'error';
                }
            }
        );
    }
    public fileToUpload: Array<File>;
    fileChangeEvent(fileInput: any){
        this.fileToUpload = <Array<File>>fileInput.target.files;
    }
}