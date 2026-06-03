import { eventBus } from './eventBus';

export interface CityData {
  name: string;
  country: string;
  lat: number;
  lng: number;
  aqi: number;
  pm25: number;
  windDirection: string;
  windSpeed: number;
}

const WIND_DIRECTIONS = ['北风', '东北风', '东风', '东南风', '南风', '西南风', '西风', '西北风'];

const PREDEFINED_CITIES: CityData[] = [
  { name: '北京', country: '中国', lat: 39.9, lng: 116.4, aqi: 150, pm25: 85, windDirection: '西北风', windSpeed: 12 },
  { name: '上海', country: '中国', lat: 31.2, lng: 121.5, aqi: 95, pm25: 48, windDirection: '东风', windSpeed: 15 },
  { name: '广州', country: '中国', lat: 23.1, lng: 113.3, aqi: 80, pm25: 40, windDirection: '南风', windSpeed: 10 },
  { name: '深圳', country: '中国', lat: 22.5, lng: 114.1, aqi: 65, pm25: 32, windDirection: '东南风', windSpeed: 14 },
  { name: '成都', country: '中国', lat: 30.6, lng: 104.1, aqi: 110, pm25: 60, windDirection: '北风', windSpeed: 5 },
  { name: '东京', country: '日本', lat: 35.7, lng: 139.7, aqi: 60, pm25: 28, windDirection: '南风', windSpeed: 18 },
  { name: '大阪', country: '日本', lat: 34.7, lng: 135.5, aqi: 55, pm25: 25, windDirection: '西南风', windSpeed: 12 },
  { name: '首尔', country: '韩国', lat: 37.6, lng: 127.0, aqi: 85, pm25: 42, windDirection: '西风', windSpeed: 10 },
  { name: '德里', country: '印度', lat: 28.6, lng: 77.2, aqi: 200, pm25: 120, windDirection: '西风', windSpeed: 8 },
  { name: '孟买', country: '印度', lat: 19.1, lng: 72.9, aqi: 170, pm25: 95, windDirection: '西南风', windSpeed: 14 },
  { name: '加尔各答', country: '印度', lat: 22.6, lng: 88.4, aqi: 185, pm25: 105, windDirection: '东南风', windSpeed: 9 },
  { name: '曼谷', country: '泰国', lat: 13.8, lng: 100.5, aqi: 120, pm25: 65, windDirection: '南风', windSpeed: 7 },
  { name: '雅加达', country: '印尼', lat: -6.2, lng: 106.8, aqi: 130, pm25: 72, windDirection: '西风', windSpeed: 8 },
  { name: '马尼拉', country: '菲律宾', lat: 14.6, lng: 121.0, aqi: 90, pm25: 45, windDirection: '东北风', windSpeed: 11 },
  { name: '河内', country: '越南', lat: 21.0, lng: 105.9, aqi: 140, pm25: 78, windDirection: '北风', windSpeed: 6 },
  { name: '新加坡', country: '新加坡', lat: 1.4, lng: 103.8, aqi: 55, pm25: 24, windDirection: '东南风', windSpeed: 9 },
  { name: '卡拉奇', country: '巴基斯坦', lat: 24.9, lng: 67.0, aqi: 180, pm25: 100, windDirection: '西南风', windSpeed: 12 },
  { name: '达卡', country: '孟加拉', lat: 23.8, lng: 90.4, aqi: 190, pm25: 110, windDirection: '南风', windSpeed: 7 },
  { name: '伦敦', country: '英国', lat: 51.5, lng: -0.1, aqi: 40, pm25: 15, windDirection: '西风', windSpeed: 20 },
  { name: '巴黎', country: '法国', lat: 48.9, lng: 2.4, aqi: 45, pm25: 18, windDirection: '西南风', windSpeed: 16 },
  { name: '柏林', country: '德国', lat: 52.5, lng: 13.4, aqi: 38, pm25: 14, windDirection: '西风', windSpeed: 18 },
  { name: '罗马', country: '意大利', lat: 41.9, lng: 12.5, aqi: 55, pm25: 25, windDirection: '南风', windSpeed: 12 },
  { name: '马德里', country: '西班牙', lat: 40.4, lng: -3.7, aqi: 50, pm25: 22, windDirection: '西风', windSpeed: 14 },
  { name: '莫斯科', country: '俄罗斯', lat: 55.8, lng: 37.6, aqi: 70, pm25: 35, windDirection: '北风', windSpeed: 10 },
  { name: '伊斯坦布尔', country: '土耳其', lat: 41.0, lng: 29.0, aqi: 75, pm25: 38, windDirection: '东北风', windSpeed: 16 },
  { name: '华沙', country: '波兰', lat: 52.2, lng: 21.0, aqi: 55, pm25: 26, windDirection: '西风', windSpeed: 14 },
  { name: '雅典', country: '希腊', lat: 37.98, lng: 23.73, aqi: 60, pm25: 28, windDirection: '北风', windSpeed: 18 },
  { name: '纽约', country: '美国', lat: 40.7, lng: -74.0, aqi: 55, pm25: 25, windDirection: '西北风', windSpeed: 22 },
  { name: '洛杉矶', country: '美国', lat: 34.1, lng: -118.2, aqi: 80, pm25: 40, windDirection: '西风', windSpeed: 12 },
  { name: '芝加哥', country: '美国', lat: 41.9, lng: -87.6, aqi: 50, pm25: 22, windDirection: '西风', windSpeed: 20 },
  { name: '休斯顿', country: '美国', lat: 29.8, lng: -95.4, aqi: 60, pm25: 28, windDirection: '东南风', windSpeed: 14 },
  { name: '多伦多', country: '加拿大', lat: 43.7, lng: -79.4, aqi: 35, pm25: 12, windDirection: '西风', windSpeed: 18 },
  { name: '墨西哥城', country: '墨西哥', lat: 19.4, lng: -99.1, aqi: 120, pm25: 65, windDirection: '东风', windSpeed: 6 },
  { name: '圣保罗', country: '巴西', lat: -23.6, lng: -46.6, aqi: 75, pm25: 36, windDirection: '东南风', windSpeed: 10 },
  { name: '布宜诺斯艾利斯', country: '阿根廷', lat: -34.6, lng: -58.4, aqi: 45, pm25: 18, windDirection: '南风', windSpeed: 16 },
  { name: '利马', country: '秘鲁', lat: -12.0, lng: -77.0, aqi: 90, pm25: 45, windDirection: '南风', windSpeed: 8 },
  { name: '波哥大', country: '哥伦比亚', lat: 4.7, lng: -74.1, aqi: 65, pm25: 30, windDirection: '东风', windSpeed: 9 },
  { name: '开罗', country: '埃及', lat: 30.0, lng: 31.2, aqi: 150, pm25: 85, windDirection: '北风', windSpeed: 12 },
  { name: '拉各斯', country: '尼日利亚', lat: 6.5, lng: 3.4, aqi: 130, pm25: 70, windDirection: '西南风', windSpeed: 10 },
  { name: '约翰内斯堡', country: '南非', lat: -26.2, lng: 28.0, aqi: 70, pm25: 34, windDirection: '东风', windSpeed: 14 },
  { name: '内罗毕', country: '肯尼亚', lat: -1.3, lng: 36.8, aqi: 65, pm25: 30, windDirection: '东风', windSpeed: 11 },
  { name: '金沙萨', country: '刚果', lat: -4.3, lng: 15.3, aqi: 80, pm25: 42, windDirection: '西风', windSpeed: 6 },
  { name: '亚的斯亚贝巴', country: '埃塞俄比亚', lat: 9.0, lng: 38.7, aqi: 90, pm25: 48, windDirection: '东风', windSpeed: 9 },
  { name: '悉尼', country: '澳大利亚', lat: -33.9, lng: 151.2, aqi: 30, pm25: 10, windDirection: '东南风', windSpeed: 22 },
  { name: '墨尔本', country: '澳大利亚', lat: -37.8, lng: 145.0, aqi: 28, pm25: 9, windDirection: '南风', windSpeed: 20 },
  { name: '奥克兰', country: '新西兰', lat: -36.9, lng: 174.8, aqi: 25, pm25: 8, windDirection: '西风', windSpeed: 24 },
  { name: '迪拜', country: '阿联酋', lat: 25.2, lng: 55.3, aqi: 100, pm25: 52, windDirection: '西北风', windSpeed: 16 },
  { name: '利雅得', country: '沙特', lat: 24.7, lng: 46.7, aqi: 130, pm25: 70, windDirection: '北风', windSpeed: 14 },
  { name: '德黑兰', country: '伊朗', lat: 35.7, lng: 51.4, aqi: 160, pm25: 90, windDirection: '西风', windSpeed: 8 },
  { name: '巴格达', country: '伊拉克', lat: 33.3, lng: 44.4, aqi: 140, pm25: 75, windDirection: '西北风', windSpeed: 10 },
];

const RANDOM_CITIES: { name: string; country: string }[] = [
  { name: '武汉', country: '中国' }, { name: '杭州', country: '中国' }, { name: '重庆', country: '中国' },
  { name: '南京', country: '中国' }, { name: '天津', country: '中国' }, { name: '西安', country: '中国' },
  { name: '苏州', country: '中国' }, { name: '长沙', country: '中国' }, { name: '郑州', country: '中国' },
  { name: '青岛', country: '中国' }, { name: '大连', country: '中国' }, { name: '厦门', country: '中国' },
  { name: '昆明', country: '中国' }, { name: '哈尔滨', country: '中国' }, { name: '沈阳', country: '中国' },
  { name: '福冈', country: '日本' }, { name: '札幌', country: '日本' }, { name: '名古屋', country: '日本' },
  { name: '釜山', country: '韩国' }, { name: '仁川', country: '韩国' },
  { name: '清迈', country: '泰国' }, { name: '吉隆坡', country: '马来西亚' },
  { name: '胡志明市', country: '越南' }, { name: '金边', country: '柬埔寨' },
  { name: '仰光', country: '缅甸' }, { name: '加德满都', country: '尼泊尔' },
  { name: '科伦坡', country: '斯里兰卡' }, { name: '伊斯兰堡', country: '巴基斯坦' },
  { name: '阿姆斯特丹', country: '荷兰' }, { name: '布鲁塞尔', country: '比利时' },
  { name: '维也纳', country: '奥地利' }, { name: '布拉格', country: '捷克' },
  { name: '布达佩斯', country: '匈牙利' }, { name: '哥本哈根', country: '丹麦' },
  { name: '斯德哥尔摩', country: '瑞典' }, { name: '赫尔辛基', country: '芬兰' },
  { name: '奥斯陆', country: '挪威' }, { name: '里斯本', country: '葡萄牙' },
  { name: '都柏林', country: '爱尔兰' }, { name: '苏黎世', country: '瑞士' },
  { name: '慕尼黑', country: '德国' }, { name: '汉堡', country: '德国' },
  { name: '巴塞罗那', country: '西班牙' }, { name: '米兰', country: '意大利' },
  { name: '圣彼得堡', country: '俄罗斯' }, { name: '新西伯利亚', country: '俄罗斯' },
  { name: '基辅', country: '乌克兰' }, { name: '布加勒斯特', country: '罗马尼亚' },
  { name: '旧金山', country: '美国' }, { name: '西雅图', country: '美国' },
  { name: '迈阿密', country: '美国' }, { name: '波士顿', country: '美国' },
  { name: '丹佛', country: '美国' }, { name: '亚特兰大', country: '美国' },
  { name: '达拉斯', country: '美国' }, { name: '菲尼克斯', country: '美国' },
  { name: '温哥华', country: '加拿大' }, { name: '蒙特利尔', country: '加拿大' },
  { name: '卡尔加里', country: '加拿大' },
  { name: '哈瓦那', country: '古巴' }, { name: '圣地亚哥', country: '智利' },
  { name: '基多', country: '厄瓜多尔' }, { name: '蒙得维的亚', country: '乌拉圭' },
  { name: '加拉加斯', country: '委内瑞拉' }, { name: '巴拿马城', country: '巴拿马' },
  { name: '卡萨布兰卡', country: '摩洛哥' }, { name: '阿尔及尔', country: '阿尔及利亚' },
  { name: '突尼斯', country: '突尼斯' }, { name: '阿克拉', country: '加纳' },
  { name: '达喀尔', country: '塞内加尔' }, { name: '坎帕拉', country: '乌干达' },
  { name: '达累斯萨拉姆', country: '坦桑尼亚' }, { name: '卢萨卡', country: '赞比亚' },
  { name: '哈拉雷', country: '津巴布韦' }, { name: '阿比让', country: '科特迪瓦' },
  { name: '阿德莱德', country: '澳大利亚' }, { name: '布里斯班', country: '澳大利亚' },
  { name: '珀斯', country: '澳大利亚' }, { name: '惠灵顿', country: '新西兰' },
  { name: '苏瓦', country: '斐济' }, { name: '莫尔兹比港', country: '巴新' },
  { name: '安曼', country: '约旦' }, { name: '多哈', country: '卡塔尔' },
  { name: '科威特城', country: '科威特' }, { name: '马斯喀特', country: '阿曼' },
  { name: '萨那', country: '也门' }, { name: '大马士革', country: '叙利亚' },
  { name: '贝鲁特', country: '黎巴嫩' }, { name: '耶路撒冷', country: '以色列' },
  { name: '开普敦', country: '南非' }, { name: '德班', country: '南非' },
  { name: '卡诺', country: '尼日利亚' }, { name: '亚历山大', country: '埃及' },
  { name: '的黎波里', country: '利比亚' }, { name: '罗安达', country: '安哥拉' },
  { name: '马普托', country: '莫桑比克' }, { name: '安塔那那利佛', country: '马达加斯加' },
  { name: '广州', country: '中国' },
  { name: '卢森堡', country: '卢森堡' }, { name: '雷克雅未克', country: '冰岛' },
  { name: '瓦莱塔', country: '马耳他' }, { name: '尼科西亚', country: '塞浦路斯' },
  { name: '塔林', country: '爱沙尼亚' }, { name: '里加', country: '拉脱维亚' },
  { name: '维尔纽斯', country: '立陶宛' }, { name: '卢布尔雅那', country: '斯洛文尼亚' },
  { name: '萨格勒布', country: '克罗地亚' }, { name: '贝尔格莱德', country: '塞尔维亚' },
  { name: '索非亚', country: '保加利亚' }, { name: '地拉那', country: '阿尔巴尼亚' },
  { name: '斯科普里', country: '北马其顿' }, { name: '波德戈里察', country: '黑山' },
  { name: '萨拉热窝', country: '波黑' }, { name: '明斯克', country: '白俄罗斯' },
  { name: '基希讷乌', country: '摩尔多瓦' }, { name: '第比利斯', country: '格鲁吉亚' },
  { name: '埃里温', country: '亚美尼亚' }, { name: '巴库', country: '阿塞拜疆' },
  { name: '阿斯塔纳', country: '哈萨克斯坦' }, { name: '塔什干', country: '乌兹别克斯坦' },
  { name: '比什凯克', country: '吉尔吉斯斯坦' }, { name: '杜尚别', country: '塔吉克斯坦' },
  { name: '阿什哈巴德', country: '土库曼斯坦' }, { name: '乌兰巴托', country: '蒙古' },
  { name: '万象', country: '老挝' }, { name: '斯里巴加湾', country: '文莱' },
  { name: '马累', country: '马尔代夫' }, { name: '廷布', country: '不丹' },
  { name: '达卡', country: '孟加拉' },
  { name: '圣地亚哥', country: '多米尼加' }, { name: '圣何塞', country: '哥斯达黎加' },
  { name: '危地马拉城', country: '危地马拉' }, { name: '圣萨尔瓦多', country: '萨尔瓦多' },
  { name: '特古西加尔巴', country: '洪都拉斯' }, { name: '马那瓜', country: '尼加拉瓜' },
  { name: '拉巴斯', country: '玻利维亚' }, { name: '亚松森', country: '巴拉圭' },
  { name: '乔治敦', country: '圭亚那' }, { name: '帕拉马里博', country: '苏里南' },
  { name: '太子港', country: '海地' }, { name: '金斯敦', country: '牙买加' },
  { name: '西班牙港', country: '特立尼达' }, { name: '拿骚', country: '巴哈马' },
  { name: '巴马科', country: '马里' }, { name: '尼亚美', country: '尼日尔' },
  { name: '恩贾梅纳', country: '乍得' }, { name: '班吉', country: '中非' },
  { name: '利伯维尔', country: '加蓬' }, { name: '布拉柴维尔', country: '刚果' },
  { name: '马普托', country: '莫桑比克' }, { name: '温得和克', country: '纳米比亚' },
  { name: '哈博罗内', country: '博茨瓦纳' }, { name: '姆巴巴内', country: '斯威士兰' },
  { name: '马塞卢', country: '莱索托' }, { name: '莫罗尼', country: '科摩罗' },
];

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function generateRandomCity(base: { name: string; country: string }): CityData {
  const aqi = randInt(30, 180);
  return {
    name: base.name,
    country: base.country,
    lat: randFloat(-40, 55),
    lng: randFloat(-120, 140),
    aqi,
    pm25: Math.round(aqi * 0.55),
    windDirection: WIND_DIRECTIONS[randInt(0, WIND_DIRECTIONS.length - 1)],
    windSpeed: randFloat(2, 25),
  };
}

let cities: CityData[] = [];
let intervalId: ReturnType<typeof setInterval> | null = null;

function initCities(): void {
  cities = [...PREDEFINED_CITIES];
  let idx = 0;
  while (cities.length < 200 && idx < RANDOM_CITIES.length) {
    const existing = cities.find(c => c.name === RANDOM_CITIES[idx].name && c.country === RANDOM_CITIES[idx].country);
    if (!existing) {
      cities.push(generateRandomCity(RANDOM_CITIES[idx]));
    }
    idx++;
  }
  while (cities.length < 200) {
    cities.push(generateRandomCity({
      name: `城市${cities.length + 1}`,
      country: '未知',
    }));
  }
}

function updateCities(): void {
  for (const city of cities) {
    const aqiDelta = randInt(-10, 10);
    city.aqi = clamp(city.aqi + aqiDelta, 0, 500);
    city.pm25 = clamp(Math.round(city.aqi * (0.4 + Math.random() * 0.3)), 0, 500);
    city.windSpeed = clamp(randFloat(city.windSpeed - 3, city.windSpeed + 3), 0, 50);
    city.windDirection = WIND_DIRECTIONS[randInt(0, WIND_DIRECTIONS.length - 1)];
  }
  eventBus.emit('DATA_UPDATE', cities);
}

export function startDataFetcher(): void {
  initCities();
  eventBus.emit('DATA_UPDATE', cities);
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
  intervalId = setInterval(updateCities, 10000);
}

export function getCities(): CityData[] {
  return cities;
}
