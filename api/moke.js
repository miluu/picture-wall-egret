var api = randomApi(180);
var apiStr = JSON.stringify(api);
document.body.innerText = apiStr;

function randomPrice() {
  return Math.floor(Math.random() * 8000) + 2000;
}

function randomBrand() {
  var brands = [
    'GIRDEAR',
    'ONLY',
    'E*P',
    'ochiry',
    'MO&CO',
    'VERY MODA',
    'Five Plus',
    'E*Land',
    'LANCY',
    'DAZZLE'
  ];
  var len = brands.length;
  var r = Math.floor(Math.random() * len);
  return brands[r];
}

function randomTitle() {
  var titles = [
    '2016春装新款连衣裙',
    '2016夏季新款女装宽松',
    '2016夏季新款女装',
    '夏装新品 绚丽欧',
    'A字裙显瘦打底裙',
    '高腰短裙A字裙',
    '镂空无袖长款连衣裙',
    '打底裙无袖连衣裙',
    '空气层面料短连衣裙',
    '白色印花中长款'
  ];
  var len = titles.length;
  var r = Math.floor(Math.random() * len);
  return titles[r];
}
function randomDescription() {
  var descriptions = [
    '服饰的变迁是一部历史，是一个时代发展的缩影。它是这个时代进步、文明、兴旺发达、繁荣昌盛的象征。它在记录历史变革的同时，也映衬着一种民族的精神，传承着当地的历史文化风俗',
    '女装更是其中不可缺少的一部分。女士穿着的衣物统称为女装。女装品牌与款式的多元化推动了时装的发展。女装使女人倍添姿彩，女装为产业增添亮点。',
    '贵妇的便装却时兴瘦，细、长，与以前各个时期不太相同，衣着的配色也打破了唐代以红紫、',
    '多采用各种间色粉紫、黑紫、葱白、银灰、沉香色等。色调淡雅、文静，合理地运用了比较高级的中性灰色调，衣饰花纹也由比较规则的唐代图案改成了写生的折枝在纹',
    '一般平民女子，尤其是劳动妇女或婢仆等，仍然穿窄袖衫襦。只是比晚唐、五代时的更瘦更长，颜色以白色为主，其它也有浅绛、浅青等。裙裤也比较瘦短，颜色以青、白色为最普遍。',
    '总的看来，宋代妇女的装束，除了北宋时曾一度流行的大袖衫襦，肥阔的裙裤外，窄、瘦、长、奇是这一时期妇女服装的主要特征。',
    '衫是一种最普通的衣式，宋代妇女的衫多半用刺绣为装饰。大多是圆领、交领、直领、对襟，腰身清秀条苗，下摆多，有较长的开气，衣料一般是用罗、纱、绫、缣等轻软的料子。',
    '襦与袄是相似的衣式，襦的造型短小，一般到腰部，对襟，侧缝下摆处开气，袖端细长，衣身也比较窄。襦有单襦，复襦，单襦与衫相近，复襦与袄相近。',
    '通常贵族妇女的服色以紫红、黄色为主，用绣罗并加上刺绣。平常的妇女多以青、白、褐色为多，上了年纪的妇女也喜欢穿紫红色的襦。',
    '窄袖衣是宋代女子中普遍流行的一种便服。式样是对襟、交领、窄袖、衣长至膝。特点是非常瘦窄，甚至贴身。由于这种服装式明代的女装已与前代不同'
  ];
  var len = descriptions.length;
  var r = Math.floor(Math.random() * len);
  return descriptions[r];
}

function randomImgs() {
  var len = Math.floor(Math.random() * 4) + 3;
  var imgs = [];
  for (var i = 0; i < len; i++) {
    var img = {
      url: '',
      width: Math.floor(Math.random() * 40) + 40,
      height: Math.floor(Math.random() * 40) + 40
    }
    imgs.push(img);
  }
  return imgs;
}

function randomItem() {
  var item = {};
  item.id = '';
  item.brand = randomBrand();
  item.title = randomTitle();
  item.descriptions = randomDescription();
  item.price = randomPrice();
  item.imgs = randomImgs();
  return item;
}

function randomApi(itemCount) {
  var api = {};
  var items = [];
  api.status = 'success';
  api.message = '加载成功';
  for (var i = 0; i < itemCount; i++) {
    items.push(randomItem());
  }
  api.result = {
    items: items
  };
  return api;
}