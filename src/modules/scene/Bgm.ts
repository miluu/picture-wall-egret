namespace scene {
  export class Bgm {
    private _sound: egret.Sound;
    private _ready: boolean;
    private _chanel: egret.SoundChannel;
    private _position: number;
    private _soundUrl: string;

    constructor (url?: string) {
      this._sound = new egret.Sound();
      this._soundUrl = url;
      if (url) {
        this.load(url);
      }
    }

    load(url: string, onComplete?: Function, onError?: Function) {
      this._sound.addEventListener(egret.Event.COMPLETE, function loadOver(event: egret.Event) {
          this._ready = true;
          if (onComplete) {
            onComplete();
          }
      }, this);
      this._sound.addEventListener(egret.IOErrorEvent.IO_ERROR, function loadError(event: egret.IOErrorEvent) {
          this._ready = false;
          console.warn('Sound load error.');
          if (onError) {
            onError();
          }
      }, this);
      this._sound.load(url);
    }

    play(resume: boolean) {
      if (!this._ready) {
        console.warn('Sound resouce is not ready yet.');
        return;
      }
      let startTime = 0;
      if (resume) {
        startTime = this._position || 0;
      }
      this._chanel = this._sound.play(startTime);
    }

    stop() {
      if (this._chanel) {
        this._position = this._chanel.position;
        this._chanel.stop();
      }
    }
  }
}
