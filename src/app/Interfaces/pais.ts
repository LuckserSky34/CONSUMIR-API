import { Departamento } from "./departamento"

export interface Pais {
    idPais:number,
    nombre:string
    departamentos: Departamento [];
}
