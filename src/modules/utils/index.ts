module util {
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
};
