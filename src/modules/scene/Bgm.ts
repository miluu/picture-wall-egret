namespace scene {
  export class Bgm {
    private _sound: egret.Sound;
    private _ready: boolean;
    private _chanel: egret.SoundChannel;
    private _position: number;
    private _inTween: boolean = false;
    public url: string;

    constructor (url?: string) {
      this._sound = new egret.Sound();
      if (url) {
        this.load(url);
      }
    }

    load(url: string, onComplete?: Function, onError?: Function) {
      if (this._inTween) {
        return;
      }
      this.url = url;
      this._sound.once(egret.Event.COMPLETE, loadOver, this);
      this._sound.once(egret.IOErrorEvent.IO_ERROR, loadError, this);
      this._sound.load(url);

      const _this = this;
      function loadOver(event: egret.Event) {
          this._ready = true;
          unListen();
          if (onComplete) {
            onComplete();
        }
      }
      function loadError(event: egret.IOErrorEvent) {
          this._ready = false;
          unListen();
          console.warn('Sound load error.');
          if (onError) {
            onError();
          }
      }
      function unListen () {
        _this._sound.removeEventListener(egret.Event.COMPLETE, loadOver, this);
        _this._sound.removeEventListener(egret.IOErrorEvent.IO_ERROR, loadError, this);
      }
    }

    play(resume?: boolean) {
      if (!this._ready || this._inTween) {
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
      if (this._inTween) {
        return;
      }
      if (this._chanel) {
        this._position = this._chanel.position;
        this._chanel.stop();
      }
    }

    fadeOut(callback?: Function) {
      if (!this._chanel || this._inTween) {
        return;
      }
      this._inTween = true;
      let tween = new TWEEN.Tween(this._chanel)
        .to({volume: 0}, 3000)
        .start()
        .onComplete(() => {
          this._inTween = false;
          this.stop();
          TWEEN.remove(tween);
          if (callback) {
            callback();
          }
        });
    }

    fadeIn(callback?: Function) {
      this.play();
      if (!this._chanel || this._inTween) {
        return;
      }
      this._chanel.volume = 0;
      this._inTween = true;
      let tween = new TWEEN.Tween(this._chanel)
        .to({volume: 1}, 3000)
        .start()
        .onComplete(() => {
          this._inTween = false;
          TWEEN.remove(tween);
          if (callback) {
            callback();
          }
        });
    }
  }
}
