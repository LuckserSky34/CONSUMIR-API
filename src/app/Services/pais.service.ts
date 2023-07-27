import { Injectable } from '@angular/core';

import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Pais } from '../Interfaces/pais';


@Injectable({
  providedIn: 'root'
})
export class PaisService {

  private endpoint:string = environment.endPoint;
  private apiUrl:string = this.endpoint + "pais/";

  constructor(private http:HttpClient) {}

  getList():Observable<Pais[]>{
   return this.http.get<Pais[]>(`${this.apiUrl}lista`)
  }

}
