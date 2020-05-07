//Modulos
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { MomentModule } from 'angular2-moment';

//Rutas
import { MessagesRoutingModule } from './menssages-routing.module'

//Componentes
import { AddComponent } from './components/add.components/add.component';
import { MainComponent } from './components/main.components/main.component';
import { ReceivedComponent } from './components/receved/received.component';
import { SendedComponent } from './components/sended/sended.component';

//Servicios
import { UserService } from '../services/user.service';
import { UserGuard } from '../services/user.guard';

@NgModule({
    declarations:[
        AddComponent,
        MainComponent,
        ReceivedComponent,
        SendedComponent
    ],
    imports:[
        CommonModule,
        FormsModule,
        MessagesRoutingModule,
        MomentModule
    ], 
    exports:[
        AddComponent,
        MainComponent,
        ReceivedComponent,
        SendedComponent
    ],
    providers:[
        UserService,
        UserGuard
    ]
})
export class MessageModule{}