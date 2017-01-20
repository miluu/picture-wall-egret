namespace swiper {
  interface ISwiperOptions {
    viewWidth: number;
    viewHeight: number;
    slideWidth: number;
    slideHeight: number;
    radius: number;
    effect?: string;
    backTime?: number;
    onChange?: (currentOffset?: number) => any;
  }
  export const SWIPER_EFFECT = {
    SLIDE: 'SLIDE',
    CARROUSEL: 'CARROUSEL'
  };
  export class Swiper extends egret.DisplayObjectContainer {
    private _slides: Slide[] = [];
    private _slidesCopy: Slide[] = [];
    private _slidesContainer: egret.DisplayObjectContainer;
    private _offset: number;
    private _viewWidth: number;
    private _viewHeight: number;
    private _slideWidth: number;
    private _slideHeight: number;
    private _radius: number;
    private _bg: egret.Shape;
    private _toutchStart: boolean;
    private _startX: number;
    private _startTime: Date;
    private _startOffset: number;
    private _touchStart: boolean;
    private _tween: TWEEN.Tween;
    private _backTime: number;
    private _effect: string;
    public onChange: (currentIndex?: number) => any;

    constructor(options: ISwiperOptions) {
      super();
      this._viewWidth = options.viewWidth;
      this._viewHeight = options.viewHeight;
      this._slideWidth = options.slideWidth;
      this._slideHeight = options.slideHeight;
      this._radius = options.radius;
      this._backTime = options.backTime || 500;
      this._effect = options.effect || SWIPER_EFFECT.SLIDE;
      this._offset = 0;
      this.onChange = options.onChange;
      this._init();
      this.addEventListener(egret.Event.ENTER_FRAME, function() {
        TWEEN.update();
      }, this);
    }

    public set effect(effect: string) {
      this._effect = effect;
      this._setSlidesPosition();
    }

    public get effect(): string {
      return this._effect;
    }

    public get activeIndex(): number {
      const offset = Math.round(this._offset);
      const slidesCount = this._slides.length;
      let index = -offset % slidesCount;
      if (index < 0) {
        index += slidesCount;
      }
      return index;
    }

    public set activeIndex(index: number) {
      index = Math.round(index);
      const offset = Math.round(this._offset);
      const slidesCount = this._slides.length;
      let currentIndex = -offset % slidesCount;
      let indexOffset = index - currentIndex;
      let toOffset = this._offset - indexOffset;
      this.goto(toOffset);
    }

    private _init() {
      this._createBg();
      this._createSlidesContainer();
    }

    private _createBg() {
      this._bg = new egret.Shape();
      const g = this._bg.graphics;
      g.beginFill(0x666666);
      g.drawRect(-this._viewWidth / 2, -this._viewHeight / 2, this._viewWidth, this._viewHeight);
      g.endFill();
      g.lineStyle(1, 0x333333);
      g.moveTo(0, -this._viewHeight / 2);
      g.lineTo(0, this._viewHeight / 2);
      g.endFill();
      this.addChild(this._bg);
      this.touchEnabled = true;
      this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
      this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this._onTouchMove, this);
      this.addEventListener(egret.TouchEvent.TOUCH_END, this._onTouchEnd, this);
      this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._onReleaseOutside, this);
    }

    private _createSlidesContainer() {
      this._slidesContainer = new egret.DisplayObjectContainer();
      this._slidesContainer.x = 0;
      this._slidesContainer.y = 0;
      this.addChild(this._slidesContainer);
    }

    public addSlide(slide: Slide) {
      const slideCopy = slide.clone();
      this._slides.push(slide);
      this._slidesCopy.push(slideCopy);
      this._slidesContainer.addChild(slide);
      this._slidesContainer.addChild(slideCopy);
      this._setSlidesPosition();
      return this;
    }

    private _onTouchBegin(e: egret.TouchEvent) {
      this._startX = e.stageX;
      this._startTime = new Date();
      this._touchStart = true;
      this._startOffset = this._offset;
    }

    private _onTouchMove(e: egret.TouchEvent) {
      if (this._touchStart) {
        this._updateOffset(e.stageX);
        this._setSlidesPosition();
      }
    }

    private _updateOffset(currentX) {
      let offsetX = currentX - this._startX;
      this._offset = this._startOffset + offsetX / this._slideWidth;
    }

    private _onTouchEnd(e: egret.TouchEvent) {
      this._stopDrag(e.stageX);
    }

    private _onReleaseOutside(e: egret.TouchEvent) {
      this._stopDrag(e.stageX);
    }

    private _stopDrag(endX: number) {
      this._updateOffset(endX);
      let endTime = new Date();
      let speed = (endX - this._startX) / (endTime.getTime() - this._startTime.getTime());
      this._startX = null;
      this._touchStart = false;
      this._startOffset = null;
      let endOffset = this._offset;
      let nearOffset: number = Math.round(endOffset);
      if (Math.abs(speed) > 0.2) {
        if (speed > 0) {
          nearOffset = Math.ceil(endOffset);
        } else {
          nearOffset = Math.floor(endOffset);
        }
      } else {
        nearOffset = Math.round(endOffset);
      }
      this.goto(nearOffset);
    }

    public goto(offset: number) {
      this._tween = new TWEEN.Tween(this)
        .to({_offset: offset}, this._backTime)
        .onStart(() => {
        })
        .onUpdate(() => {
          this._setSlidesPosition();
        })
        .onComplete(() => {
          this._setSlidesPosition();
          if (this.onChange) {
            this.onChange(offset);
          }
        })
        .easing(TWEEN.Easing.Quartic.Out)
        .start();
    }

    private _setSlidesPosition() {
      const slides = this._slidesCopy.concat(this._slides);
      _.forEach(slides, (slide, index) => {
        this._useEffect(slide, index);
      });
      if (this._effect === SWIPER_EFFECT.CARROUSEL) {
        _.chain(slides)
          .sortBy('scaleX')
          .forEach((slide, index) => {
            this._slidesContainer.setChildIndex(slide, index);
          })
          .value();
      }
    }

    private _useEffect(slide: Slide, index: number) {
      const slidesCount = this._slides.length;
      const totalCount = slidesCount * 2;
      const effect = this._effect;
      const i = index - slidesCount;
      const radius = this._radius;
      switch (effect) {
        case SWIPER_EFFECT.CARROUSEL:
          let perDeg = Math.PI * 2 / totalCount;
          let slideDeg = perDeg * (i + this._offset);
          let x = radius * Math.sin(slideDeg);
          let z = Math.cos(slideDeg);
          let scale = (z + 1) / 2;
          slide.x = x;
          slide.z = z;
          if (z > 0) {
            slide.visible = true;
            if (z > 0.3) {
              slide.alpha = 1;
            } else {
              slide.alpha = z / 0.3;
            }
          } else {
            slide.visible = false;
          }

          slide.scaleX = slide.scaleY = scale;
          break;
        default:
          slide.y = 0;
          slide.x = (i + this._offset) * this._slideWidth;
          break;
      }
    }
  }
}
