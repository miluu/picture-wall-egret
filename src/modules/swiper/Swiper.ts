/**
 * @namespace Swiper
 * @author HuangYaxiong <hyxiong@qq.com>
 */

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
    selfUpdate?: boolean;
  }

  /**
   * @const swiper 切换效果
   */
  export const SWIPER_EFFECT = {
    SLIDE: 'SLIDE',
    CARROUSEL: 'CARROUSEL'
  };

  /**
   * @class Swiper
   */
  export class Swiper extends egret.DisplayObjectContainer {
    /**
     * @private 所有的 slide 对象
     */
    private _slides: Slide[] = [];
    /**
     * @private 所有的 slide 对象拷贝
     */
    private _slidesCopy: Slide[] = [];
    /**
     * @private slide 的容器对象
     */
    private _slidesContainer: egret.DisplayObjectContainer;
    /**
     * @private 偏移量，一个 slide 位置为 1
     */
    private _offset: number;
    /**
     * @private 视图宽度
     */
    private _viewWidth: number;
    /**
     * @private 视图高度
     */
    private _viewHeight: number;
    /**
     * @private slide 宽度
     */
    private _slideWidth: number;
    /**
     * @private slide 高度
     */
    private _slideHeight: number;
    /**
     * @private CARROUSEL 跑马灯效果的半径大小
     */
    private _radius: number;
    /**
     * @private 背景 Shape 对象
     */
    private _bg: egret.Shape;
    /**
     * @private 开始触摸时的 x 坐标
     */
    private _startX: number;
    /**
     * @private 开始触摸时的时间
     */
    private _startTime: Date;
    /**
     * @private 开始触摸时的偏移量
     */
    private _startOffset: number;
    /**
     * @private 开始触摸标识
     */
    private _touchStart: boolean;
    /**
     * @private 关联的 Tween 对象，用于设置 slide 的回弹效果
     */
    private _tween: TWEEN.Tween;
    /**
     * @private 回弹时间间隔
     */
    private _backTime: number;
    /**
     * @private 滑动效果
     */
    private _effect: string;
    /**
     * @private 是否自动更新，如为 true，则会在 swiper 内监听 ENTER_FRAME 并执行 TWEEN.update()
     */
    private _selfUpdate: boolean;
    /**
     * @public 额外关联的 Tween 对象
     */
    public tween: TWEEN.Tween;
    /**
     * @public 切换 slide 完成时的回调事件
     */
    public onChange: (currentIndex?: number) => any;

    /**
     * @constructor
     * @param options {ISwiperOptions} 选项
     */
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
      this._selfUpdate = options.selfUpdate || false;
      this._init();
      if (this._selfUpdate) {
        this.addEventListener(egret.Event.ENTER_FRAME, function() {
          TWEEN.update();
        }, this);
      }
    }

    /**
     * @public
     * @set 设置 effect 效果
     * @param effect {string}
     */
    public set effect(effect: string) {
      this._effect = effect;
      this._setSlidesPosition();
    }

    /**
     * @public
     * @get 获取 effect
     * @return {string}
     */
    public get effect(): string {
      return this._effect;
    }

    /**
     * @public
     * @get 获取当前激活序号
     * @return number
     */
    public get activeIndex(): number {
      const offset = Math.round(this._offset);
      const slidesCount = this._slides.length;
      let index = -offset % slidesCount;
      if (index < 0) {
        index += slidesCount;
      }
      return index;
    }

    /**
     * @public
     * @set 设置当前激活序号
     * @param index {number}
     */
    public set activeIndex(index: number) {
      index = Math.round(index);
      const offset = Math.round(this._offset);
      const slidesCount = this._slides.length;
      let currentIndex = -offset % slidesCount;
      let indexOffset = index - currentIndex;
      let toOffset = this._offset - indexOffset;
      this.goto(toOffset);
    }

    /**
     * @private 初始化
     */
    private _init() {
      this._createBg();
      this._createSlidesContainer();
    }

    /**
     * @private 创建背景，监听触摸事件
     */
    private _createBg() {
      this.touchEnabled = true;
      this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
      this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this._onTouchMove, this);
      this.addEventListener(egret.TouchEvent.TOUCH_END, this._onTouchEnd, this);
      this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._onReleaseOutside, this);
    }

    /**
     * @private 创建 slides 容器
     */
    private _createSlidesContainer() {
      this._slidesContainer = new egret.DisplayObjectContainer();
      this._slidesContainer.x = 0;
      this._slidesContainer.y = 0;
      this.addChild(this._slidesContainer);
    }

    /**
     * @public 添加一个 slide
     * @param slide {Slide}
     */
    public addSlide(slide: Slide) {
      const slideCopy = slide.clone();
      this._slides.push(slide);
      this._slidesCopy.push(slideCopy);
      this._slidesContainer.addChild(slide);
      this._slidesContainer.addChild(slideCopy);
      this._setSlidesPosition();
      return this;
    }

    /**
     * @private 开始触摸时回调
     * @param e {egret.TouchEvent}
     */
    private _onTouchBegin(e: egret.TouchEvent) {
      this._startX = e.stageX;
      this._startTime = new Date();
      this._touchStart = true;
      this._startOffset = this._offset;
    }

    /**
     * @private 触摸移动时回调
     * @param e {egret.TouchEvent}
     */
    private _onTouchMove(e: egret.TouchEvent) {
      if (this._touchStart) {
        this._updateOffset(e.stageX);
        this._setSlidesPosition();
      }
    }

    /**
     * @private 触摸移动时回调
     * @param e {egret.TouchEvent}
     */
    private _updateOffset(currentX) {
      let offsetX = currentX - this._startX;
      this._offset = this._startOffset + offsetX / this._slideWidth;
    }

    /**
     * @private 触摸结束时回调
     */
    private _onTouchEnd(e: egret.TouchEvent) {
      this._stopDrag(e.stageX);
    }

    /**
     * @private 触摸结束时回调
     */
    private _onReleaseOutside(e: egret.TouchEvent) {
      this._stopDrag(e.stageX);
    }

    /**
     * private 结束拖动
     */
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

    /**
     * @public 设置偏移量
     * @param offset {number}
     */
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

    /**
     * @private 根据偏移量和滑动效果设置 slide 的位置
     */
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

    /**
     * @private 对 slide 应用 effect 效果
     * @param slide {Slide}
     * @param index {number} 序号
     */
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
            if (z > 0.5) {
              slide.alpha = 1;
            } else {
              slide.alpha = z / 0.5;
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
