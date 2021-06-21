import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Lot {
  _id?: string;
  _rev?: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class LotService {

  constructor(private http: HttpClient) { }

  getLot(id) {
    return this.http.get<Lot>(`/api/lot/${id}`).toPromise();
  }

  getAllLots() {
    return this.http.get<Lot[]>("/api/lot").toPromise();
  }

  addLot(lot: Lot) {
    return this.http.post<Lot>("/api/lot", lot).toPromise();
  }

  updateLot(lot: Lot) {
    return this.http.put<Lot>("/api/lot", lot).toPromise();
  }

  deleteLot(id) {
    return this.http.delete<Lot>(`/api/lot/${id}`).toPromise();
  }
}
