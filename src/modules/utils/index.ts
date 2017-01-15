namespace util {
  /**
   * 返回距离中心点一定距离和角度的点
   * @param center {egret.Point} 中心点对象
   * @param radius {number} 半径
   * @param degree {number} 角度
   * @return {egret.Point} 返回距离中心点一定距离和角度的点
   */
  export function cyclePoint(center: egret.Point, radius: number, degree: number): egret.Point {
    let x = Math.cos(degree * Math.PI / 180) * radius;
    let y = Math.sin(degree * Math.PI / 180) * radius;
    x += center.x;
    y += center.y;
    return new egret.Point(x, y);
  }

  /**
   * 将 '#ddd', '#123456' 格式的 css 颜色字符串转换成数字
   * @param colorString {number} 要进行转换的字符串
   * @return {number} 转换后的数字，转换不成功则默认为 0 (黑色)
   */
  export function colorStringToNumber(colorString: string): number {
    let str = colorString.replace('#', '');
    if (str.length === 3) {
      let charArr = str.split('');
      str = _.map(str, (c) => c + c).join('');
    }
    return parseInt(str, 16) || 0x000000;
  }

  /**
   * 将一个尺寸等比缩放至指定高度后的新尺寸
   * @param originSize {scene.ISize} 原始尺寸，包含宽、高信息
   * @param height {number} 新的高度值
   * @return {scene.ISize} 调整后的高度
   */
  export function fixHeight(originSize: scene.ISize, height: number): scene.ISize {
    let newSize = <scene.ISize>{};
    newSize.height = height;
    newSize.width = originSize.width / originSize.height * newSize.height;
    return newSize;
  }
};
