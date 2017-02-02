namespace detail {
  let detailDiv: HTMLElement;
  let detailContentDiv: HTMLElement;
  let closeBtn: HTMLElement;
  let detailIframe: HTMLIFrameElement;
  export let operateCallback: Function = null;
  export let shown = false;

  detailDiv = document.querySelector('#detail') as HTMLElement;
  detailContentDiv = detailDiv.querySelector('.detail-content') as HTMLElement;
  closeBtn = detailContentDiv.querySelector('.btn-close') as HTMLElement;
  detailIframe = detailContentDiv.querySelector('iframe');
  detailContentDiv.addEventListener('transitionend', hideDiv);
  closeBtn.addEventListener('click', hide);
  detailDiv.addEventListener('mousedown', operate);

  export function show() {
    shown = true;
    detailDiv.classList.remove('hide');
    detailDiv.classList.remove('detail-out');
    detailIframe.setAttribute('src', '/detail.html');
    detailIframe.addEventListener('load', function() {
      detailIframe.contentWindow.document.addEventListener('mousedown', operate);
      detailIframe.contentWindow.document.addEventListener('touchstart', operate);
    });
  }

  export function hide() {
    shown = false;
    detailDiv.classList.add('detail-out');
    detailIframe.contentWindow.document.removeEventListener('mousedown', operate);
    detailIframe.contentWindow.document.removeEventListener('touchstart', operate);
  }

  function hideDiv() {
    if (!shown) {
      detailDiv.classList.add('hide');
    }
  }

  function operate() {
    if (operateCallback) {
      operateCallback();
    }
  }
}
