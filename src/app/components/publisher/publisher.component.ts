import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Publication } from '../../models/publication';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { UploadService } from '../../services/upload.service';
@Component({
    selector: 'publisher',
    templateUrl: './publisher.component.html',
    providers: [UserService, PublicationService, UploadService]
})
export class PublisherComponent implements OnInit {
    public title: string;
    public identity;
    public token;
    public url: string;
    public status: string;
    public page;
    public publication: Publication;

    constructor(
        private myRouter: Router,
        private myUserService: UserService,
        private myUploadService: UploadService,
        private myPublicationService: PublicationService
    ) {
        this.title = 'publisher';
        this.identity = this.myUserService.getIdentity();
        this.token = this.myUserService.getToken();
        this.url = GLOBAL.url;
        this.page = 1;
        this.publication = new Publication ("","","","",this.identity._id);
    }
    ngOnInit() {
        console.log('publisher Component is load!');
    }
    onSubmit(form, event){
        this.myPublicationService.addPublication(this.token, this.publication).subscribe(
            response => {
                if(response.publication){
                    if(this.filesToUpload && this.filesToUpload.length){
                        this.myUploadService.makeFileRequest(this.url+'publication/update/'+response.publication._id,[],this.filesToUpload, this.token,'file')
                                                    .then((result:any) =>{
                                                        this.publication.file = result.image;
                                                        this.status = 'success';
                                                        form.reset();
                                                        this.myRouter.navigate(['/timeline']);
                                                        this.sended.emit({send:'true'});
                                                    });
                    }else{
                        this.status = 'success';
                        form.reset();
                        this.myRouter.navigate(['/timeline']);
                        this.sended.emit({send:'true'});
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
    public filesToUpload: Array<File>;
    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
    //Output
    @Output () sended = new EventEmitter();
    sendPublications(event){
        this.sended.emit({send:'true'});
    }
}