import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ticker } from '../models/ticker';

@Injectable({
  providedIn: 'root'
})
export class TickerService {

  public tickers: Array<Ticker> = [];

  constructor(private readonly _httpClient: HttpClient) { }

  public getTickers(symbol: string = ""): Observable<Array<Ticker>>{
    return this._httpClient.get<Array<Ticker>>(`${environment.baseUrl}/tickers?symbol=${symbol}`).pipe(map(t => {
      if (symbol != null && symbol != undefined && symbol != ""){
        this.tickers.map(ticker => {
          if (ticker.symbol == symbol){
            ticker.price = t[0].price;
          }
        })
      } else{
        this.tickers = t;
      }      
      return t;
    }));
  }
}
