/**
 * @namespace detail 详情页面模块
 * @author HuangYaxiong <hyxiong@qq.com>
 */
namespace detail {
  let detailDiv: HTMLElement;
  let detailContentDiv: HTMLElement;
  let detailMaskDiv: HTMLElement;
  let closeBtn: HTMLElement;
  let detailIframe: HTMLIFrameElement;
  /**
   * @export 有操作时的回调方法
   */
  export let operateCallback: Function = null;
  /**
   * @export 显示状态
   */
  export let shown = false;

  init();

  /**
   * 初始化
   */
  function init() {
    detailDiv = document.querySelector('#detail') as HTMLElement;
    detailContentDiv = detailDiv.querySelector('.detail-content') as HTMLElement;
    closeBtn = detailContentDiv.querySelector('.btn-close') as HTMLElement;
    detailMaskDiv = detailDiv.querySelector('.mask') as HTMLElement;
    detailIframe = detailContentDiv.querySelector('iframe');
    detailContentDiv.addEventListener('transitionend', hideDiv);
    closeBtn.addEventListener('click', hide);
    detailMaskDiv.addEventListener('click', hide);
    detailDiv.addEventListener('mousedown', operate);
  }

  /**
   * @export 显示详情
   */
  export function show() {
    shown = true;
    detailDiv.classList.remove('hide');
    detailDiv.classList.remove('detail-out');
    detailMaskDiv.classList.add('show');
    detailIframe.setAttribute('src', '/detail.html');
    detailIframe.addEventListener('load', function() {
      detailIframe.contentWindow.document.addEventListener('mousedown', operate);
      detailIframe.contentWindow.document.addEventListener('touchstart', operate);
    });
  }

  /**
   * @export 隐藏说成
   */
  export function hide() {
    shown = false;
    detailDiv.classList.add('detail-out');
    detailMaskDiv.classList.remove('show');
    detailIframe.contentWindow.document.removeEventListener('mousedown', operate);
    detailIframe.contentWindow.document.removeEventListener('touchstart', operate);
  }

  /**
   * 隐藏详情 Div
   */
  function hideDiv() {
    if (!shown) {
      detailDiv.classList.add('hide');
    }
  }

  /**
   * 有操作时回调
   */
  function operate() {
    if (operateCallback) {
      operateCallback();
    }
  }
}
