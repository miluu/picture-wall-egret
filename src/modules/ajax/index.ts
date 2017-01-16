namespace ajax {

  interface IAjaxOptions {
    type?: string;
    onComplete?: (data?: any) => any;
    onError?: () => any;
    onProgress?: (bytesLoaded: number, bytesTotal: number) => any;
  }

  interface IFormatReturn {
    success: boolean;
    data: any;
  }

  /**
   * 发送一个 get 请求并返回数据
   * @param url {string} url字符串
   * @param options {IAjaxOptions} 可选参数选项，type: 数据类型， onComplete: 加载完成回调方法，接收参数为返回数据， onError: 加载错误回调方法
   */
  export function get(url: string, options?: IAjaxOptions) {
    let loader = new egret.URLLoader();
    let req = new egret.URLRequest(url);
    let defaultOpt: IAjaxOptions = {
      type: 'text',
      onComplete: function() {},
      onError: function() {},
      onProgress: function() {}
    };
    let combinedOptions = _.assign({}, defaultOpt, options) as IAjaxOptions;
    if (combinedOptions.type === 'image') {
      loader.dataFormat = egret.URLLoaderDataFormat.TEXTURE;
    }
    loader.load(req);
    loader.once(egret.Event.COMPLETE, function() {
      let {success, data} = format(combinedOptions.type, loader.data);
      success
        ? combinedOptions.onComplete(data)
        : combinedOptions.onError();
    }, null);
    loader.once(egret.IOErrorEvent.IO_ERROR, function() {
      combinedOptions.onError();
    }, null);
    loader.addEventListener(egret.ProgressEvent.PROGRESS, function(e: egret.ProgressEvent) {
      combinedOptions.onProgress(e.bytesLoaded, e.bytesTotal);
    }, null);
  }

  /**
   * 发送一个 get 请求并返回 JSON 数据
   * @param url {string} url字符串
   * @param options {IAjaxOptions} 可选参数选项, onComplete: 加载完成回调方法，接收参数为返回数据， onError: 加载错误回调方法
   */
  export function getJson(url: string, options?: IAjaxOptions) {
    (<IAjaxOptions>options).type = 'json';
    get(url, options);
  }

  /**
   * 发送一个 get 请求并返回 Texture 数据
   * @param url {string} url字符串
   * @param options {IAjaxOptions} 可选参数选项, onComplete: 加载完成回调方法，接收参数为返回数据， onError: 加载错误回调方法
   */
  export function getTexture(url: string, options?: IAjaxOptions) {
    (<IAjaxOptions>options).type = 'image';
    get(url, options);
  }

  /**
   * 格式化数据
   * @param type {string} 数据的类型
   * @param data {string} 需要进行格式化的数据
   */
  function format(type: string, data: any): IFormatReturn {
    let retData;
    let ret: IFormatReturn = {
      success: true,
      data
    };
    switch (type) {
      case 'json':
        try {
          retData = JSON.parse(data);
          ret.data = retData;
        } catch (e) {
          ret.success = false;
        }
        break;
      default:
        break;
    }
    return ret;
  }
}
