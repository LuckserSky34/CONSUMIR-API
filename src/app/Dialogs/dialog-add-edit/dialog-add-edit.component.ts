import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder,FormGroup,Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import { Pais } from 'src/app/Interfaces/pais';
import { Empleado } from 'src/app/Interfaces/empleado';
import { PaisService } from 'src/app/Services/pais.service';
import { EmpleadoService } from 'src/app/Services/empleado.service';
import { Departamento } from 'src/app/Interfaces/departamento';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }

}

@Component({
  selector: 'app-dialog-add-edit',
  templateUrl: './dialog-add-edit.component.html',
  styleUrls: ['./dialog-add-edit.component.css'],
  providers:[{
    provide: MAT_DATE_FORMATS, useValue : MY_DATE_FORMATS
  }]
})
export class DialogAddEditComponent implements OnInit {
  
  formEmpleado: FormGroup;
  tituloAccion: string = "Nuevo";
  botonAccion: string = "Guardar";
  listaPais: Pais[]=[];
  listaDepartamentos: Departamento[]=[];
  selectdPaisId: number = 0;

  constructor(
    private dialogoReferencia:MatDialogRef<DialogAddEditComponent>,
    private fb:FormBuilder,
    private _snackbar:MatSnackBar,
    private _paisService: PaisService,
    private _empleadoService:EmpleadoService,
    @Inject (MAT_DIALOG_DATA) public dataEmpleado: Empleado
  ) {

    this.formEmpleado = this.fb.group({
      nombres:['',Validators.required],
      apellidos:['',Validators.required],
      idPais:['',Validators.required],
      idDepartamento:['',Validators.required],
      sueldo:['',Validators.required],
      fechaContrato:['',Validators.required]
    })

    this._paisService.getList().subscribe({
      next:(data)=>{
        this.listaPais = data;
      },
      error:(error)=>{
        console.error('Error al obtener la lista de países:', error);
      }
    });
  }

  mostrarAlerta(msg:string, accion:string) {
    this._snackbar.open(msg, accion,{
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:3000
    })
  }


  addEditEmpleado(){
    console.log(this.formEmpleado.value)

    const modelo : Empleado = {
      idEmpleado : 0,
      nombres : this.formEmpleado.value.nombres,
      apellidos : this.formEmpleado.value.apellidos,
      idPais : this.formEmpleado.value.idPais,
      idDepartamento : this.formEmpleado.value.idDepartamento,
      sueldo : this.formEmpleado.value.sueldo,
      fechaContrato: new Date(this.formEmpleado.value.fechaContrato).toISOString()
    }
    
    this._empleadoService.add(modelo).subscribe({
      next:(data)=>{
        this.mostrarAlerta("Empleado fue creado","Listo");
        this.dialogoReferencia.close("creado")
      },error:(e)=>{
        this.mostrarAlerta("No se pudo crear","Error")
      }
    })

  }

  obtenerDepartamentosPorPais(idPais: number): void {
  const paisSeleccionado = this.listaPais.find((pais) => pais.idPais == idPais);
  if (paisSeleccionado) {
    this.listaDepartamentos = paisSeleccionado.departamentos;
  } else {
    this.listaDepartamentos = [];
  }
}

  
  

  ngOnInit(): void {
    this.selectdPaisId = this.dataEmpleado ? this.dataEmpleado.idPais : 0;
  
    this.formEmpleado.get('idPais')?.valueChanges.subscribe((paisId) => {
      this.obtenerDepartamentosPorPais(paisId);
    });
  
    if (this.selectdPaisId) {
      this.obtenerDepartamentosPorPais(this.selectdPaisId);
    }
  
    if (this.dataEmpleado) {
      this.formEmpleado.patchValue({
        nombres: this.dataEmpleado.nombres,
        apellidos: this.dataEmpleado.apellidos,
        idPais: this.dataEmpleado.idPais,
        idDepartamento: this.dataEmpleado.idDepartamento,
        sueldo: this.dataEmpleado.sueldo,
        fechaContrato: moment(this.dataEmpleado.fechaContrato, "DD/MM/YYYY").toDate()
      });
      this.formEmpleado.get('idDepartamento')?.setValue(this.dataEmpleado.idDepartamento)
    } 
  }
  

}
