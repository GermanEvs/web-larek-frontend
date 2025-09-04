# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами
  Описание архитектуры
  Приложение использует паттерн MVP (Model-View-Presenter) с четким разделением ответственности:

Model - только хранение данных

View - только отображение и обработка пользовательского ввода

Presenter - бизнес-логика, координация, запросы к API

Взаимодействие между слоями организовано через события (EventEmitter). Модели генерируют события при изменении данных, презентер подписывается на эти события и обновляет View. View генерирует события при действиях пользователя, презентер обрабатывает их и изменяет Model.

Слой Модели (Model)
Отвечает исключительно за хранение и модификацию данных приложения.

Класс AppState (Модель состояния приложения)

Назначение: Централизованное хранилище состояния приложения. Содержит все данные: товары, корзину, данные заказа.

Конструктор: constructor(events: EventEmitter) - принимает экземпляр EventEmitter для генерации событий при изменении состояния.

Поля:

catalog: IProduct[] = [] - массив всех товаров, полученных с сервера

basket: IProduct[] = [] - массив товаров, добавленных пользователем в корзину

preview: string | null = null - идентификатор товара, который currently просматривается в модальном окне

order: IOrder - объект с данными для оформления заказа (адрес, оплата, контакты)

Методы:

setCatalog(items: IProduct[]): void - сохраняет массив товаров и генерирует событие 'items:changed'

getCatalog(): IProduct[] - возвращает полный список товаров

getBasket(): IProduct[] - возвращает текущее содержимое корзины

addToBasket(product: IProduct): void - добавляет товар в корзину и генерирует событие 'basket:changed'

removeFromBasket(id: string): void - удаляет товар из корзины по ID и генерирует событие 'basket:changed'

clearBasket(): void - полностью очищает корзину и генерирует событие 'basket:changed'

getTotalPrice(): number - вычисляет и возвращает общую стоимость всех товаров в корзине

setPreview(id: string): void - устанавливает ID товара для предпросмотра в модальном окне

setOrderField(field: keyof IOrder, value: string): void - устанавливает значение для конкретного поля заказа

getOrder(): IOrder - возвращает текущие данные заказа

Слой Сервисов (Services)
Отвечает за взаимодействие с внешним API.

Базовый класс Api (из src/components/base/api.ts)

Назначение: Базовый класс для выполнения HTTP-запросов. Инкапсулирует общую логику работы с сетью.

Конструктор: constructor(baseUrl: string, options: RequestInit = {}) - принимает базовый URL API и опциональные настройки для запросов.

Методы:

get(uri: string): Promise<object> - выполняет GET-запрос по указанному URI

post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object> - выполняет POST/PUT/DELETE запрос с данными

protected handleResponse(response: Response): Promise<object> - обрабатывает ответ сервера, выбрасывает ошибки при неудачных запросах

Класс APIClient (Наследник от Api)

Назначение: Специализированный клиент для работы с API "Веб-ларек". Реализует конкретные методы API.

Конструктор: constructor(baseUrl: string) - принимает базовый URL API магазина.

Методы:

getProductList(): Promise<IProduct[]> - запрашивает список всех товаров с сервера

orderProducts(order: IOrder): Promise<IOrderResult> - отправляет данные заказа на сервер для обработки

Слой Представления (View)
Отвечает за отображение данных пользователю и обработку пользовательского ввода.

Базовый класс Component<T>

Назначение: Абстрактный базовый класс для всех компонентов интерфейса. Инкапсулирует общую логику рендеринга.

Конструктор: constructor(protected container: HTMLElement, events?: { [key: string]: (event: Event) => void }) - принимает DOM-контейнер для рендеринга и опциональные обработчики событий.

Методы:

render(container?: HTMLElement): HTMLElement - рендерит компонент в указанный или установленный контейнер

abstract setData(data: Partial<T>): void - абстрактный метод для установки данных в компонент (должен быть реализован в потомках)

Класс Page

Назначение: Главный компонент страницы. Управляет основными областями интерфейса.

Конструктор: constructor() - инициализирует ссылки на DOM-элементы страницы.

Поля:

gallery: HTMLElement - контейнер для отображения галереи товаров

basketCounter: HTMLElement - элемент для отображения счетчика товаров в корзине

modal: Modal - экземпляр модального окна для показа деталей и форм

Методы:

setCounter(count: number): void - обновляет значение счетчика корзины

Класс Card (Наследник от Component<IProduct>)

Назначение: Компонент карточки товара в каталоге. Отображает основную информацию о товаре.

Конструктор: constructor(container: HTMLElement, events?: { [key: string]: (event: Event) => void }) - принимает контейнер и обработчики событий.

Методы:

setData(data: Partial<IProduct>): void - заполняет карточку данными товара (название, цена, изображение, категория)

Генерируемые события: 'card:select' (при клике на карточку, передает { id: string })

Класс CardPreview (Наследник от Component<IProduct>)

Назначение: Компонент детального просмотра товара в модальном окне. Показывает полную информацию.

Конструктор: constructor(container: HTMLElement, events?: { [key: string]: (event: Event) => void })

Методы:

setData(data: Partial<IProduct>): void - заполняет модальное окно данными товара

Генерируемые события: 'card:add' (при клике на кнопку "В корзину", передает { id: string })

Класс Basket (Наследник от Component)

Назначение: Компонент корзины товаров. Отображает список выбранных товаров и общую стоимость.

Конструктор: constructor(container: HTMLElement, events?: { [key: string]: (event: Event) => void })

Методы:

setItems(items: IProduct[]): void - отображает переданный список товаров в корзине

setTotalPrice(price: number): void - отображает общую стоимость товаров

Генерируемые события: 'basket:delete' (при клике на кнопку удаления, передает { id: string }), 'basket:order' (при клике на кнопку "Оформить")

Класс OrderForm (Наследник от Component<IOrder>)

Назначение: Форма ввода данных для доставки. Валидирует и собирает информацию о заказе.

Конструктор: constructor(container: HTMLElement, events?: { [key: string]: (event: Event) => void })

Методы:

setData(data: Partial<IOrder>): void - заполняет поля формы данными

setValid(value: boolean): void - активирует/деактивирует кнопку отправки

Генерируемые события: 'order:submit' (при успешной валидации и отправке формы, передает объект IOrder)

Класс ContactsForm (Наследник от Component<IOrder>)

Назначение: Форма ввода контактных данных. Валидирует email и телефон.

Конструктор: constructor(container: HTMLElement, events?: { [key: string]: (event: Event) => void })

Методы:

setData(data: Partial<IOrder>): void - заполняет поля формы данными

setValid(value: boolean): void - активирует/деактивирует кнопку оплаты

Генерируемые события: 'contacts:submit' (при успешной валидации и отправке формы, передает объект IOrder)

Класс Success (Наследник от Component<IOrderResult>)

Назначение: Компонент успешного оформления заказа. Покажает итоговую информацию.

Конструктор: constructor(container: HTMLElement, events?: { [key: string]: (event: Event) => void })

Методы:

setData(data: Partial<IOrderResult>): void - отображает информацию о выполненном заказе

Класс Modal

Назначение: Управление модальными окнами. Отвечает за открытие, закрытие и оверлей.

Конструктор: constructor() - инициализирует DOM-элементы модального окна.

Методы:

open(content: HTMLElement): void - открывает модальное окно и помещает в него переданный контент

close(): void - закрывает модальное окно и очищает контент

Слой Презентера (Presenter)
Связывает Model, View и Services. Обрабатывает бизнес-логику, выполняет запросы к API, координирует взаимодействие между компонентами.

Код размещен в основном файле приложения (src/index.ts) и включает:

Инициализацию компонентов:

typescript
// Создание экземпляров
const events = new EventEmitter();
const api = new APIClient(process.env.API_ORIGIN);
const appState = new AppState(events);
const page = new Page();
const modal = new Modal();
Обработку запросов к API:

typescript
// Загрузка товаров при старте приложения
api.getProductList()
.then(products => appState.setCatalog(products))
.catch(console.error);

// Отправка заказа при завершении оформления
events.on('contacts:submit', () => {
const order = appState.getOrder();
api.orderProducts(order)
.then(result => {
events.emit('success:submit', result);
appState.clearBasket();
})
.catch(console.error);
});
Подписку на события и координацию:

typescript
// Обновление интерфейса при изменении корзины
events.on('basket:changed', () => {
const basket = appState.getBasket();
const total = appState.getTotalPrice();
// ... обновление компонентов корзины ...
});
Взаимодействие на примере загрузки товаров:
Presenter (index.ts): При запуске приложения вызывает api.getProductList()

Service (APIClient): Выполняет GET-запрос к серверу для получения списка товаров

Presenter: Получает данные от API и вызывает appState.setCatalog(products)

Model (AppState): Сохраняет товары в состояние и генерирует событие 'items:changed'

Presenter: Слушает событие 'items:changed' и вызывает рендер компонентов каталога

View (Card, Page): Компоненты перерисовываются с полученными данными товаров

Основные типы данных
typescript
/\*\*

- Объект товара, возвращаемый API
  \*/
  export interface IProduct {
  id: string; // Уникальный идентификатор товара
  description: string; // Подробное описание товара
  image: string; // URL изображения товара
  title: string; // Название товара
  category: string; // Категория товара ('софт-скил', 'другое' и т.д.)
  price: number | null; // Цена товара в синапсах (может быть null)
  }

/\*\*

- Данные, необходимые для оформления заказа
  \*/
  export interface IOrder {
  payment: 'online' | 'offline' | null; // Способ оплаты
  address: string; // Адрес доставки
  email: string; // Электронная почта для связи
  phone: string; // Телефон для связи
  items: string[]; // Массив идентификаторов товаров в заказе
  total: number; // Общая стоимость заказа
  }

/\*\*

- Ответ сервера при успешном оформлении заказа
  \*/
  export interface IOrderResult {
  id: string; // Идентификатор созданного заказа
  total: number; // Итоговая сумма списания
  }

/\*\*

- Состояние корзины товаров
  \*/
  export type BasketState = {
  items: IProduct[]; // Товары в корзине
  total: number; // Общая стоимость
  };

/\*\*

- События приложения с типами передаваемых данных
  \*/
  export type AppEvents = {
  'items:changed': IProduct[]; // Изменился список товаров
  'basket:changed': BasketState; // Изменилась корзина
  'card:select': { id: string }; // Выбран товар для просмотра
  'card:add': { id: string }; // Добавление товара в корзину
  'basket:delete': { id: string }; // Удаление товара из корзины
  'basket:order': void; // Начало оформления заказа
  'order:submit': IOrder; // Отправка данных доставки
  'contacts:submit': IOrder; // Отправка контактных данных
  'success:submit': IOrderResult; // Успешное оформление заказа
  'modal:open': void; // Открытие модального окна
  'modal:close': void; // Закрытие модального окна
  };

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```
