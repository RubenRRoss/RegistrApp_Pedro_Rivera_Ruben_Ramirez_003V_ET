import { Component, OnInit } from '@angular/core';
import { AlertController, mdTransitionAnimation, NavController } from '@ionic/angular';
import { RegistrodeprofesoresService, Usuariop } from '../../services/registrodeprofesores.service';
import { ToastController } from '@ionic/angular';
import { FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-registroProfe',
  templateUrl: './registroProfe.page.html',
  styleUrls: ['./registroProfe.page.scss'],
})
export class RegistroProfePage implements OnInit {

  formularioRegistroProfe : FormGroup; 
  newUsuariop: Usuariop = <Usuariop>{};
  usuariosp: Usuariop[] =[]; 

  constructor(private alertController: AlertController, 
              private NavCtrl: NavController,
              private registroProfeService: RegistrodeprofesoresService, 
              private toastController: ToastController, 
              private fb: FormBuilder) {
                this.formularioRegistroProfe = fb.group({ 
                  'nombre' : new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(15)]),
                  'correo' : new FormControl("",[Validators.required, Validators.minLength(8), Validators.maxLength(25)]), 
                  'password': new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(15)]),
                  'confirmaPass': new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(15)])
                })
               }

  ngOnInit() {
  }

  async CrearUsuariop(){
    var form = this.formularioRegistroProfe.value; 
    var existente = 0;
    if(this.formularioRegistroProfe.invalid){
      const alert = await this.alertController.create({ 
        header: 'Error..',
        message: 'Los datos ingresados son incorrectos',
        buttons: ['Aceptar']
      })
      await alert.present();
      return;
    }
    else {
      if(form.password!=form.confirmaPass){
        this.alertError();
  
      }
    else{
      this.newUsuariop.nomUsuariop = form.nombre;
      this.newUsuariop.correoUsuariop = form.correo;
      this.newUsuariop.passUsuariop = form.password;
      this.newUsuariop.repassUsuariop = form.confirmaPass;
      this.registroProfeService.getUsuariosp().then(datos=>{ 
        this.usuariosp = datos; 
    
        if (!datos || datos.length==0){
          this.registroProfeService.addUsuariop(this.newUsuariop).then(dato=>{ 
            this.newUsuariop=<Usuariop>{};
            this.showToast('Usuario Profesor Creado');
          });
          this.formularioRegistroProfe.reset();
          this.NavCtrl.navigateRoot('loginProfe');
        }else{
        
        for (let obj of this.usuariosp){
          if (this.newUsuariop.correoUsuariop == obj.correoUsuariop){
            existente = 1;
          }
        }
        if (existente == 1){
          this.alertDuplicado();
         
        }
        else{
          this.registroProfeService.addUsuariop(this.newUsuariop).then(dato=>{ 
            this.newUsuariop=<Usuariop>{};
            this.showToast('Usuario Profesor Creado');
          });
          this.formularioRegistroProfe.reset();
          this.NavCtrl.navigateRoot('loginProfe');
        }
    }
  }
)}
  }
  }
  async showToast(msg: string): Promise<void>{
    const toast = await this.toastController.create({ 
      message : msg,
      duration: 2000
    })
    await toast.present();
  }
  async alertError() {
    const alerta = await this.alertController.create({
      header: 'Las contraseñas no coinciden.',
      message: ' Vuelva a Intentar ',
      buttons: ['Aceptar']
    }) 
    await alerta.present();
  }

  async alertDuplicado(){
    const alert = await this.alertController.create({ 
      header: '¡Error!',
      message: 'Correo ya Existente, Ingrese otro',
      buttons: ['Volver']
    })
    await alert.present();
  }





}
