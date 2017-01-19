namespace swiper {
  export class Swiper extends egret.DisplayObjectContainer {

  }
}


// namespace swiper {
//   export interface ISwiperOptions {
//     viewWidth: number;
//     viewHeight: number;
//     slideWidth: number;
//     slideHeight: number;
//     padding?: number;
//     effect?: 'none' | 'slide' | 'carrousel';
//     backTime?: number;
//     activeCenter?: boolean;
//     loop?: boolean;
//     carrousel?: IEffectCarrouselOptions;
//   }

//   export interface IEffectCarrouselOptions {
//     maxSideSidesCount?: number;
//     minScale?: number;
//     radius?: number;
//   }

//   export class Swiper extends egret.DisplayObjectContainer {
//     public slides: Slide[] = [];
//     private _slideOffset = 0;
//     private _activeIndex = 0;
//     private _bg: egret.Shape;
//     private _slidesContainer: egret.DisplayObjectContainer;
//     private _startX: number = null;
//     private _startTime: number = null;
//     private _touchStart: boolean = false;
//     private _startSlideOffset: number = null;
//     private _tw: egret.Tween = null;
//     private _options: ISwiperOptions;
//     public onChange: (activeIndex?: number, preActiveIndex?: number) => any;

//     constructor(options: ISwiperOptions) {
//       super();
//       this._options = _.assign({}, {
//         padding: 10,
//         effect: 'slide',
//         backTime: 500,
//         activeCenter: true,
//         carrousel: {}
//       }, options);
//       this._addBg();
//       this._createSlidesContainer();
//     }
//     public start() {
//       this.updateSlidesPosition();
//       return this;
//     }
//     public slidesCount() {
//       return this.slides.length;
//     }
//     public updateSlidesPosition() {
//       let offset = this._slideOffset;
//       console.log(offset.toFixed(3));
//       const {activeCenter, viewWidth, slideWidth, padding} = this._options;
//       let posOffset: number = activeCenter
//         ? viewWidth / 2
//         : slideWidth / 2 + padding;
//       _.forEach(this.slides, (slide) => {
//         this._useEffect(slide, slide.options.index, posOffset);
//       });
//       if (this._options.effect === 'carrousel') {
//         _.chain(this.slides)
//           .sortBy('scaleX')
//           .forEach((slide, index) => {
//             this._slidesContainer.setChildIndex(slide, index);
//           })
//           .value();
//       }
//       return this;
//     }
//     private _useEffect(slide: Slide, index: number, posOffset: number) {
//       const {slideWidth, padding, effect} = this._options;
//       switch (effect) {
//         case 'carrousel':
//           let haha = index === 0;
//           let slidesCount = this.slidesCount();
//           let carrouselOptions = this._options.carrousel;
//           let radius = carrouselOptions.radius || 130;
//           let minScale = carrouselOptions.minScale || 0.2;
//           let sideSlidesCount = Math.floor(slidesCount / 2);
//           let slideOffset = (this._slideOffset + index) % slidesCount;
//           if (slideOffset < 0) {
//             slideOffset += slidesCount;
//           }
//           if (haha) {
//             // console.log('--------');
//             // console.log('this._slideOffset', this._slideOffset);
//             // console.log('slideOffset', slideOffset);
//           }
//           let ang = slideOffset / (sideSlidesCount + 1) * Math.PI / 2;
//           let x = radius * Math.sin(ang);
//           let z = Math.abs(Math.cos(ang));
//           slide.x = x + posOffset;
//           slide.scaleX = slide.scaleY = z * (1 - minScale) + minScale;
//           slide.alpha = z;
//           break;
//         default:
//           slide.x = (this._options.slideWidth + this._options.padding * 2) * (index + this._slideOffset) + posOffset;
//           break;
//       }
//     }
//     private _addBg() {
//       this._bg = new egret.Shape();
//       const {viewWidth, viewHeight} = this._options;
//       let g = this._bg.graphics;
//       g.beginFill(0xffffff, 0.5);
//       g.drawRect(0, 0, viewWidth, viewHeight);
//       g.endFill();
//       this.addChild(this._bg);
//       this._bg.touchEnabled = true;
//       this._bg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
//       this._bg.addEventListener(egret.TouchEvent.TOUCH_MOVE, this._onTouchMove, this);
//       this._bg.addEventListener(egret.TouchEvent.TOUCH_END, this._onTouchEnd, this);
//       this._bg.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._onReleaseOutside, this);
//     }
//     public get activeIndex() {
//       return this._activeIndex;
//     }
//     public set activeIndex(index: number) {
//       this.goto(index);
//     }
//     public goto(index: number) {
//       let preActiveIndex = this._activeIndex;
//       const {backTime, loop} = this._options;
//       const lastIndex = this.slidesCount() - 1;
//       if (!loop) {
//         if (index < 0) {
//           index = 0;
//         } else if (index > lastIndex) {
//           index = lastIndex;
//         }
//       }
//       this._tw = egret.Tween.get(this, {
//         onChange: function() {
//           this.updateSlidesPosition();
//         },
//         onChangeObj: this
//       })
//         .to({_slideOffset: index}, backTime, egret.Ease.quartOut)
//         .call(function() {
//           this._activeIndex = index;
//           this._tw = null;
//           if (this.onChange) {
//             this.onChange(index, preActiveIndex);
//           }
//         }, this);
//       return this;
//     }
//     private _stopDrag(endX: number) {
//       this._updateOffset(endX);
//       let endTime = +new Date();
//       let speed = (endX - this._startX) / (endTime - this._startTime);
//       this._startX = null;
//       this._touchStart = false;
//       this._startSlideOffset = null;
//       let endOffset = this._slideOffset;
//       let nearOffset: number = Math.round(endOffset);
//       console.log(speed);
//       if (Math.abs(speed) > 0.2) {
//         if (speed > 0) {
//           nearOffset = Math.ceil(endOffset);
//         } else {
//           nearOffset = Math.floor(endOffset);
//         }
//       } else {
//         nearOffset = Math.round(endOffset);
//       }
//       console.log('nearOffset:', nearOffset);
//       this.goto(nearOffset);
//     }
//     private _updateOffset(currentX) {
//       let offsetX = currentX - this._startX;
//       let {padding, slideWidth} = this._options;
//       this._slideOffset = this._startSlideOffset + (offsetX / (slideWidth + padding * 2));
//     }
//     private _onTouchBegin(e: egret.TouchEvent) {
//       this._startX = e.stageX;
//       this._startTime = +new Date();
//       this._touchStart = true;
//       this._startSlideOffset = this._slideOffset;
//       if (this._tw) {
//         this._tw.setPaused(true);
//         this._tw = null;
//       }
//     }
//     private _onTouchMove(e: egret.TouchEvent) {
//       if (this._touchStart) {
//         this._updateOffset(e.stageX);
//         this.updateSlidesPosition();
//       }
//     }
//     private _onTouchEnd(e: egret.TouchEvent) {
//       this._stopDrag(e.stageX);
//     }
//     private _onReleaseOutside(e: egret.TouchEvent) {
//       this._stopDrag(e.stageX);
//     }
//     private _createSlidesContainer() {
//       const {viewWidth, viewHeight, slideWidth, slideHeight} = this._options;
//       this._slidesContainer = new egret.DisplayObjectContainer();
//       this.addChild(this._slidesContainer);
//       this._slidesContainer.y = slideHeight / 2;
//       this._slidesContainer.mask = new egret.Rectangle(0, -slideHeight / 2, viewWidth, viewHeight);
//     }
//     public addSlide(content?: egret.DisplayObject) {
//       const {slideWidth, slideHeight} = this._options;
//       let slide = new Slide(slideWidth, slideHeight, content);
//       this.slides.push(slide);
//       this._slidesContainer.addChild(slide);
//       return this;
//     }
//   }
// }
