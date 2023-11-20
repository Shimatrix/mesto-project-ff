//открытие любого попапа
export function openPopups(popup) {
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', closePopupsEsc);//добавить слушатель закрытия попапа на esc
}

//закрытие любого попапа
export function closePopups(popup) {
    popup.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', closePopupsEsc);//убрать слушатель закрытия попапа на esc
};

//закрытие попапа на оверлей
export function closePopupsOverlay(evt) {
    if (evt.target === evt.currentTarget) {
        closePopups(evt.target);
    }
}

//закрытие попапа на esc
function closePopupsEsc(evt) {
    if (evt.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        closePopups(openedPopup);
    }
}