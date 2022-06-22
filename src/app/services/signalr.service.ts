import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { filter, map, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SignalrMessage } from '../models/signalr-message';
import { Ticker } from '../models/ticker';
import { TickerService } from './ticker.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private _connection: signalR.HubConnection;
  private _connection$$: ReplaySubject<signalR.HubConnection> = new ReplaySubject<signalR.HubConnection>(1);

  constructor(private readonly _tickerService: TickerService) {
    this._connection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.baseUrl}/subscribe`, {
        transport: signalR.HttpTransportType.WebSockets,
        skipNegotiation: true
      }).build();

    this.startConnection();
  }

  public get connection$$(): ReplaySubject<signalR.HubConnection> {
    return this._connection$$;
  }

  public closeConnection(): void {
    this._connection?.stop();
  }

  public joinGroup(groupId: string): void {
    this._connection.send("joinGroup", groupId);
  }

  public leaveGroup(groupId: string): void {
    this._connection.send("leaveGroup", groupId);
  }

  private startConnection(): void {
    this._connection.start().then(_ => {
      this._connection$$.next(this._connection);

      this._connection.on("RefreshTicker", (data: Ticker) => {
        this._tickerService.tickers.map(x => {
          if (x.symbol == data.symbol){
            x .price = data.price
          }
        })
      });

      this._connection.on("TickerAdded", (data: Ticker) => {
        this._tickerService.tickers.push(data);
      })
    });
  }
}
