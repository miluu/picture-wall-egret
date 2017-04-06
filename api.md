## `getconfig` 获取配置信息，返回显示的设置信息
> getconfig?deviceid=9

```js
{
  "status": "success",
  "message": "加载成功",
  "result": {
    "config": {
      "rowCount": 6,        // {number} 显示行数
      "padding": 20,        // {number} 图片间隔(px)
      "speed": 0.5,         // {number} 滚动速度
      "sceneChangeTime": 60,    // {number} 场景切换时间间隔(秒)
      "autoResetTime": 15,      // {number} 无人操作自动恢复时间间隔(秒)
      "bgColor": "#f2f2f2",     // {string} 背景色
      "bgImage": "/assets/images/bg/bg.jpg",    // {string} 背景图url
      "showDetailAnimationTime": 3000           // {number} 点击商品后的过渡动画时间间隔(毫秒)
    }
  }
}
```

## `getitems` 获取商品列表
> getitems?deviceid=9&page=1

```js
{
  "status": "success",
  "message": "加载成功",
  "result": {
    "items": [
      {
        "goodsno": "0",                   // {string} 商品 id (goodsno?)
        "brand": "SELECTED",         // {string} 商品品牌
        "title": "青少年圆领体恤",   // {string} 商品标题
        "description": "思莱德SELECTED女士纯棉彩色图案休闲T恤C416201037 海军蓝 155/76/XS",    // {string} 商品描述
        "price": 1129,               // {number} 商品价格
        "detailUrl": "/detail.html?id=0",   // {string} 商品详情页面url
        "thumbnail": {               // 缩略图
          "url": "/assets/images/imgs/thumb/TB25v95qFXXXXXyXpXXXXXXXXXX_!!2175014669.jpg",    // {string} 缩略图url
          "width": 750,              // {number} 图片宽度(px)
          "height": 796              // {number} 图片高度(px)
        },
        "imgs": [                    // 图片列表
          {
            "url": "/assets/images/imgs/TB25v95qFXXXXXyXpXXXXXXXXXX_!!2175014669.jpg",    // {string} 图片url
            "width": 750,            // {number} 图片宽度(px)
            "height": 796            // {number} 图片高度(px)
          },
          // ...
        ],
        "extraItems": [              // 环形菜单列表
          {
            "icon": "/assets/images/icons/1.png",       // {string} 菜单按钮图标url
            "bgColor": "red",                           // {string} 菜单按钮背景色
            "type": 1,                                  // {number} 类型，业态type=1、标签type=2
            "condition": "红色"                         // {string} 搜索条件
          },
          // ...
        ],
      },
      // ...
    ]
  }
}
```

## `getitemdetail` 获取商品详细信息
> getitemdetail?deviceid=9&getype=1&goodsno=1

> getitemdetail?deviceid=9&getype=2&goodsno=1

## `getsaletype` 获取业态列表，返回如餐饮、男装、鞋子之类，显示在星星环绕
> getsaletype?deviceid=9

```js
{
  "status": "success",
  "message": "加载成功",
  "result": {
    "saleTypes": [
      {
        "icon": "/assets/images/icons/1.png",       // {string} 菜单按钮图标url
        "bgColor": "red",                           // {string} 菜单按钮背景色
        "type": 1,                                  // {number} 类型，业态type=1、标签type=2
        "condition": "红色"                         // {string} 搜索条件
      },
      // ...
    ],
  }
}
```

## `getsearch` 搜索商品（按业态type=1、按标签type=2），返回显示的商品列表，返回格式类似getitems接口
> getsearch?deviceid=9&type=1&condition=餐饮

> getsearch?deviceid=9&type=2&condition=红色

返回格式同 `getitems`