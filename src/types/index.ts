/**
 * Описание объекта товара, возвращаемого API
 */
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

/**
 * Данные, необходимые для оформления заказа
 */
export interface IOrder {
    payment: 'online' | 'offline' | null; // Способ оплаты
    address: string; // Адрес доставки
    email: string; // Электронная почта
    phone: string; // Телефон
    items: string[]; // Массив идентификаторов товаров (id)
    total: number; // Общая стоимость заказа
}

/**
 * Ответ сервера при успешном оформлении заказа
 */
export interface IOrderResult {
    id: string; // Идентификатор заказа
    total: number; // Итоговая сумма заказа
}

/**
 * Интерфейс для работы с API Ларек
 * (Расширяет базовый класс Api, добавляя типизацию)
 */
export interface ILarekAPI {
    getProductList: () => Promise<IProduct[]>;
    getProductItem: (id: string) => Promise<IProduct>;
    orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

/**
 * Состояние корзины товаров
 */
export type BasketState = {
    items: IProduct[];
    total: number;
};

/**
 * Состояние модального окна
 */
export type ModalState = {
    isOpen: boolean;
    content: HTMLElement | null;
};

/**
 * События, используемые в приложении
 * Ключ - название события, значение - тип данных, передаваемых с событием
 */
export type AppEvents = {
    'items:changed': IProduct[];
    'basket:changed': BasketState;
    'card:select': { id: string };
    'card:add': { id: string };
    'basket:delete': { id: string };
    'basket:order': void;
    'order:submit': IOrder;
    'contacts:submit': IOrder;
    'success:submit': IOrderResult;
    'modal:open': void;
    'modal:close': void;
};