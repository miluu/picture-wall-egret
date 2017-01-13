module ajax {
  interface IGetJsonOptions {
    onComplete?: (data?: any) => any;
    onError?: () => any;
  }
  interface IAjaxOptions extends IGetJsonOptions {
    type?: string;
  }
  export function get(url: string, options?: IAjaxOptions) {
    let loader = new egret.URLLoader();
    let req = new egret.URLRequest(url);
    let defaultOpt: IAjaxOptions = {
      type: 'text',
      onComplete: function() {},
      onError: function() {}
    };
    let combinedOptions = _.assign({}, defaultOpt, options) as IAjaxOptions;
    loader.load(req);
    loader.addEventListener(egret.Event.COMPLETE, function() {
      let {success, data} = format(combinedOptions.type, loader.data);
      success
        ? combinedOptions.onComplete(data)
        : combinedOptions.onError();
    }, null);
    loader.addEventListener(egret.IOErrorEvent.IO_ERROR, function() {
      combinedOptions.onError();
    }, null);
  }
  export function getJson(url: string, options?: IGetJsonOptions) {
    (<IAjaxOptions>options).type = 'json';
    get(url, options);
  }
  interface IFormatReturn {
    success: boolean;
    data: any;
  }
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
