import { Component, OnInit } from '@angular/core';
import { filter, switchMap } from 'rxjs';
import { Ticker } from 'src/app/models/ticker';
import { SignalrService } from 'src/app/services/signalr.service';
import { TickerService } from 'src/app/services/ticker.service';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html',
  styleUrls: ['./engine.component.scss']
})
export class EngineComponent implements OnInit {

  constructor(
    private readonly _signalRService: SignalrService,
    public readonly _tickerService: TickerService) { }

  ngOnInit(): void {
    this._signalRService.connection$$
      .pipe(filter(conn => conn != undefined && conn != null))
      .subscribe(() => this._signalRService.joinGroup("TickerAdded"))

    this._tickerService.getTickers().subscribe()
  }

  public subscribeOrUnsubscribe(ticker: Ticker, subscription: boolean){
    if (!subscription){
      this._signalRService.connection$$
      .pipe(filter(conn => conn != undefined && conn != null))
      .subscribe(() => this._signalRService.leaveGroup(ticker.symbol))
    } else{
      this._signalRService.connection$$
      .pipe(filter(conn => conn != undefined && conn != null),
      switchMap(conn => {
        this._signalRService.joinGroup(ticker.symbol);
        return this._tickerService.getTickers(ticker.symbol)
      }))
      .subscribe();
    }
    ticker.isSubscribed = subscription;
  }

}
