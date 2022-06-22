import { Ticker } from "./ticker";

export class SignalrMessage {
    data: Ticker;

    public constructor(data: Ticker) {
        this.data = data;
    }
}
