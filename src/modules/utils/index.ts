module util {
  export function cyclePoint(center: egret.Point, radius: number, degree: number): egret.Point {
    let x = Math.cos(degree * Math.PI / 180) * radius;
    let y = Math.sin(degree * Math.PI / 180) * radius;
    x += center.x;
    y += center.y;
    return new egret.Point(x, y);
  }
};
