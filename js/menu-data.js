/*
  Меню и данные кофейни-кондитерской DOFAMIN.
  Источник: Instagram @dofamincake — сторис «Меню» и «Десерты», подписи к постам, шапка профиля (ноябрь 2026).
  Названия, описания и составы — их словами. Ничего не придумано.

  Цены: подтверждены только три (есть в их публикациях). У остальных price: null —
  на сайте пишется «цена уточняется». Когда придёт прайс, достаточно вписать число.

  photo: имя файла в img/menu/ (без расширения). Нет фото — позиция показывается строкой.
*/

const SHOP = {
  name: 'DOFAMIN',
  tagline: 'coffee & pastry',
  whatsapp: '79639887344',
  phoneHuman: '+7 963 988-73-44',
  address: 'ул. Лорсанова, 5',
  city: 'Грозный',
  instagram: 'dofamincake',
  gis: 'https://2gis.ru/grozny/firm/70000001111437714',
  yandex: 'https://yandex.ru/maps/?text=%D0%93%D1%80%D0%BE%D0%B7%D0%BD%D1%8B%D0%B9%2C%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%9B%D0%BE%D1%80%D1%81%D0%B0%D0%BD%D0%BE%D0%B2%D0%B0%2C%205',
  // Часы по времени Грозного (UTC+3), в минутах от полуночи. Закрытие в 00:00 = 24*60.
  hours: { open: 8 * 60, close: 24 * 60 }
};

const CATEGORIES = [
  { id: 'deserty',  title: 'Десерты',  label: 'Десерт' },
  { id: 'vypechka', title: 'Выпечка',  label: 'Выпечка' },
  { id: 'zavtraki', title: 'Завтраки', label: 'Завтрак' },
  { id: 'blyuda',   title: 'Блюда',    label: 'Блюдо' },
  { id: 'napitki',  title: 'Напитки',  label: 'Напиток' }
];

const ITEMS = [
  // ——— Десерты (сторис «Десерты») ———
  { id: 'korpusnoe-malina', cat: 'deserty', photo: 'korpusnoe-malina', price: 350,
    name: 'Корпусное «Малина»',
    line: 'Лёгкая текстура, яркая малиновая начинка и идеальное сочетание вкусов.' },
  { id: 'korpusnoe-inzhir', cat: 'deserty', photo: 'korpusnoe-inzhir', price: null,
    name: 'Корпусное «Инжир»',
    line: 'Нежная начинка внутри хрустящего корпуса — изысканный десерт с особенным вкусом.' },
  { id: 'mango-kokos', cat: 'deserty', photo: 'mango-kokos', price: null,
    name: 'Корпусное «Манго-кокос»',
    line: 'Тропическое сочетание нежного кокоса и яркого манго в хрустящем корпусе — свежо, нежно и необычно.' },
  { id: 'fistashkovyi-tort', cat: 'deserty', photo: 'fistashkovyi-tort', price: null,
    name: 'Фисташковый торт',
    line: 'Нежный, насыщенный фисташковый вкус и идеальное сочетание крема и мягких коржей.' },
  { id: 'tiramisu', cat: 'deserty', photo: 'tiramisu', price: null,
    name: 'Тирамису',
    line: 'Нежный крем, ароматный кофе и лёгкая нотка какао — классика, которой невозможно не наслаждаться.' },
  { id: 'chizkeik-oreo', cat: 'deserty', photo: 'chizkeik-oreo', price: null,
    name: 'Чизкейк Oreo',
    line: 'Сливочный чизкейк с насыщенным вкусом Oreo — нежный, кремовый и с приятным хрустом.' },
  { id: 'krasnyi-barkhat', cat: 'deserty', photo: 'krasnyi-barkhat', price: null,
    name: 'Чизкейк «Красный бархат»',
    line: 'Нежный сливочный чизкейк с насыщенным вкусом и бархатистой текстурой.' },
  { id: 'tartaletka', cat: 'deserty', photo: 'tartaletka-yagodnaya', price: null,
    name: 'Ягодная тарталетка',
    line: 'Нежная тарталетка с яркими ягодами — лёгкая, свежая и невероятно ароматная.' },
  { id: 'kartoshka', cat: 'deserty', photo: 'kartoshka', price: null,
    name: 'Десерт «Картошка»',
    line: 'Та самая любимая классика — нежная, шоколадная и невероятно уютная.' },
  { id: 'inzhir', cat: 'deserty', photo: 'inzhir', price: null,
    name: 'Десерт с инжиром',
    line: 'Спелый инжир сверху и нежный крем внутри.' },

  // ——— Выпечка (посты) ———
  { id: 'kruassan-morozhenoe', cat: 'vypechka', photo: 'kruassan-morozhenoe', price: null,
    name: 'Круассан с мороженым',
    line: 'Хрустящий круассан + нежное мороженое — идеальное сочетание.' },
  { id: 'gnezdyshko', cat: 'vypechka', photo: 'novinka-vypechka', price: null,
    name: 'Слоёное гнёздышко с вишней',
    line: 'Сочетание, в которое невозможно не влюбиться.' },
  { id: 'kukis', cat: 'vypechka', photo: 'kukis', price: null,
    name: 'Шоколадный кукис',
    line: 'В мире, где все помешаны на протеине, не забывай, кто ты.' },

  // ——— Завтраки (сторис «Меню») ———
  { id: 'chechenskiy-zavtrak', cat: 'zavtraki', photo: 'chechenskiy-zavtrak', price: 550,
    name: 'Чеченский завтрак',
    line: 'Всё, что нужно для доброго утра по-домашнему.',
    sostav: 'Помидор, чеснок, сметана, творог, яйцо, лук зелёный, грудинка, кукурузные лепёшки, 3 шт.' },
  { id: 'syrniki', cat: 'zavtraki', photo: 'syrniki', price: null,
    name: 'Сырники с ягодами',
    line: 'Нежные сырники с ягодами, ягодным соусом и сметаной.',
    sostav: 'Сырники, банан, клубника, малина, черника, ягодный соус, сметана и мята.' },
  { id: 'lokumash', cat: 'zavtraki', photo: 'lokumash', price: null,
    name: 'Локъмаш (пышки)',
    line: 'Воздушные домашние пышки без дрожжей.',
    sostav: 'Подаются с аджикой и сметаной с творогом.' },
  { id: 'siskal', cat: 'zavtraki', photo: 'siskal-to-beram', price: null,
    name: 'Сискал тIо-берам',
    line: 'Кукурузные лепёшки со сметаной и домашним творогом.',
    sostav: 'Кукурузные лепёшки, сметана, домашний творог, бэйби-картофель, лук.' },
  { id: 'talbina', cat: 'zavtraki', photo: null, price: null,
    name: 'Тальбина',
    line: 'Любимая каша Пророка Мухаммада ﷺ. Нежная ячменная каша с финиками и орехами.' },

  // ——— Блюда (сторис «Меню») ———
  { id: 'sendvich-govyadina', cat: 'blyuda', photo: 'sendvich-govyadina', price: null,
    name: 'Сэндвич с томлёной говядиной',
    line: 'Одно из блюд, которое гости выбирают особенно часто: говядина томится до нежности.' },
  { id: 'boul-losos', cat: 'blyuda', photo: 'boul-losos', price: null,
    name: 'Боул с лососем',
    line: 'Сытно, свежо и ярко: на обед или поздний завтрак.',
    sostav: 'Лосось, киноа, авокадо, кукуруза, морские водоросли вакаме, жёлтые помидоры, микрозелень и сливочный соус.' },
  { id: 'boul-krevetki', cat: 'blyuda', photo: 'boul-krevetki', price: null,
    name: 'Боул с креветками',
    line: 'Рис или киноа на выбор.',
    sostav: 'Киноа или рис, сёмга, черри, чука, кукуруза, авокадо, авторский соус.' },
  { id: 'grik-chiken', cat: 'blyuda', photo: 'grik-chiken', price: null,
    name: 'Грик чикен',
    line: 'С хрустящим куриным филе, бэйби-картофелем и свежим салатом.' },
  { id: 'shnicel', cat: 'blyuda', photo: 'shnicel', price: null,
    name: 'Шницель',
    line: 'Нежное куриное филе в золотистой хрустящей панировке — сытное блюдо, которое хочется попробовать снова.' },
  { id: 'tom-yam', cat: 'blyuda', photo: 'tom-yam', price: null,
    name: 'Том ям',
    line: 'Тот самый том ям — пряный, сливочный и невероятно аппетитный, с ароматным рисом и свежей зеленью.' },
  { id: 'sendvich-koreyskiy', cat: 'blyuda', photo: 'sendvich-koreyskiy', price: null,
    name: 'Сэндвич по-корейски',
    line: 'Бриошь, тунец, яйцо, зелёный лук и авторский соус.' },
  { id: 'grecheskiy', cat: 'blyuda', photo: 'grecheskiy-salat', price: 450,
    name: 'Греческий салат',
    line: 'Классика, которая всегда кстати.',
    sostav: 'Помидоры, огурцы, болгарский перец, красный лук, сыр фета, маслины, оливковое масло, орегано, соль, лимонный сок.' },

  // ——— Напитки (подписи к постам и отзывы) ———
  { id: 'espresso-sivak', cat: 'napitki', photo: null, price: null,
    name: 'Эспрессо с сиваком',
    line: 'Только в DOFAMIN. Сивак — веточка дерева арак: им чистят зубы уже больше 7000 лет.' },
  { id: 'kazakh-chay', cat: 'napitki', photo: null, price: null,
    name: 'Казахский чай',
    line: 'Настоящий казахский чай и казахстанский шоколад к нему.' },
  { id: 'kapuchino', cat: 'napitki', photo: null, price: null,
    name: 'Капучино',
    line: 'Гостья в 2ГИС: «Вкуснее кофе не пробовала».' },
  { id: 'amerikano', cat: 'napitki', photo: null, price: null,
    name: 'Американо',
    line: 'Особенно хорош с казахстанским шоколадом.' },
  { id: 'matcha', cat: 'napitki', photo: null, price: null,
    name: 'Матча',
    line: 'Угадай, где матча, а где кофе.' },
  { id: 'tonik', cat: 'napitki', photo: null, price: null,
    name: 'Фирменный тоник',
    line: 'Гостья подписала сторис: «Лучший тоник».' }
];

// Витрина — горизонтальный блок под первым экраном.
// tint — тёмный оттенок цвета десерта: фон блока перекрашивается под тот, что сейчас в центре.
// action: 'cart' — в корзину, 'wa' — бронь в WhatsApp.
const VITRINA = [
  { id: 'moti', photo: 'moti', tag: 'Новинка', tint: '#4f2431',
    name: 'Чизкейк-моти',
    line: 'Их разбирают быстрее, чем успеваешь выбрать любимый вкус. Когда вкусы закончатся, следующей партии придётся ждать.',
    flavors: ['Буэно', 'Клубника', 'Фисташка и малина', 'Черника', 'Дубайская начинка', 'Кокосовый Bounty', 'Манго', 'Ананас', 'Тути фрути'],
    action: 'wa', btn: 'Забронировать моти',
    wa: 'Здравствуйте! Хочу забронировать моти-кейки. Какие вкусы есть сегодня?' },
  { id: 'kinder', photo: 'kinder-bueno', tag: 'Новинка', tint: '#47291a',
    name: 'Огромный Kinder Bueno',
    line: 'Да-да, тот самый, только в XXL-формате!',
    action: 'wa', btn: 'Заказать в WhatsApp',
    wa: 'Здравствуйте! Хочу заказать огромный Kinder Bueno. Подскажите цену и когда можно забрать.' },
  { id: 'korpusnoe-malina', photo: 'korpusnoe-malina', tag: 'Хочу — могу', tint: '#56121d',
    name: 'Корпусное «Малина»',
    line: 'Лёгкая текстура, яркая малиновая начинка и идеальное сочетание вкусов.',
    action: 'cart', btn: 'В корзину' },
  { id: 'mango-kokos', photo: 'mango-kokos', tag: 'Корпусное', tint: '#4e2d0f',
    name: 'Манго-кокос',
    line: 'Тропическое сочетание нежного кокоса и яркого манго в хрустящем корпусе.',
    action: 'cart', btn: 'В корзину' },
  { id: 'fistashkovyi-tort', photo: 'fistashkovyi-tort', tag: 'Торт', tint: '#2c3318',
    name: 'Фисташковый торт',
    line: 'Нежный, насыщенный фисташковый вкус и идеальное сочетание крема и мягких коржей.',
    action: 'cart', btn: 'В корзину' },
  { id: 'kruassan-morozhenoe', photo: 'kruassan-morozhenoe', tag: 'Тренд', tint: '#45250f',
    name: 'Круассан с мороженым',
    line: 'Мы тоже решили его попробовать — и теперь готовим для вас.',
    action: 'cart', btn: 'В корзину' }
];

// Отзывы — дословно из 2ГИС (ноябрь 2026), имена сокращены.
const REVIEWS = [
  { text: 'Место с одним из самых вкусных завтраков в Грозном! Много позиций в меню, вкусные десерты и уютный интерьер. Отдельно хочется отметить очень милый персонал.', who: 'Городской житель', date: '15 августа 2026' },
  { text: 'Очень крутое заведение: от дизайна до качества и вкуса еды и кофе. Есть проектор: по просьбе включали то, что я хотел. Персонал и сервис на уровне.', who: 'Мансур А.', date: '13 августа 2026' },
  { text: 'Сэндвич с томлёной говядиной — это любовь. Такой вкусняшки не ела нигде.', who: 'Элиза Д.', date: '7 августа 2026' },
  { text: 'Чудесная атмосфера. Десерты — это что-то неземное. Место не похоже ни на одно заведение, что радует. Советую.', who: 'Городской житель', date: '29 июля 2026' }
];
