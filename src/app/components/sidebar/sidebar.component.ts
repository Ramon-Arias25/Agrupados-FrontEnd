import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';
import { UploadService } from '../../services/upload.service';
@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.v2.component.html',
    providers: [UserService, PublicationService, UploadService]
})
export class SidebarComponent implements OnInit{
    public identity;
    public token;
    public stats;
    public url;
    public status;
    public publication: Publication;

    constructor(
        private myUserService: UserService,
        private myPublicationService: PublicationService,
        private myUploadService: UploadService,
        private myRoute: ActivatedRoute,
        private myRouter: Router,
    ){
         this.identity = this.myUserService.getIdentity();
         this.token = this.myUserService.getToken();
         this.stats = this.myUserService.getStats();
         this.url = GLOBAL.url;
         this.publication = new Publication ("","","","",this.identity._id);
    }

    ngOnInit(){
        console.log('sidebar.component is load!');
    }

    onSubmit(form, event){
        //console.log(this.publication);
        this.myPublicationService.addPublication(this.token, this.publication).subscribe(
            response => {
                if(response.publication){
                    //this.publication = response.publication;
                    if(this.filesToUpload && this.filesToUpload.length){
                    //Subir Imagen
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
        //console.log('sendEvent');
        //console.log(event);
        this.sended.emit({send:'true'});
    }
}