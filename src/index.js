import './pages/index.css';
import {initialCards} from './scripts/cards.js'
// @todo: Темплейт карточки
const templateCards = document.querySelector('#card-template').content; //помещаем темплейт в переменную
const placesItem = document.querySelector('.places__list'); //сохраняем новую карточку в список (ul)

// @todo: Функция создания карточки
function createCard (cardData, deletHandler, likeHandler){
    const cardElement = templateCards.querySelector ('.card').cloneNode(true); //клонировали свойства темплейта
    cardElement.querySelector('.card__title').textContent = cardData.name; //добавили название
    cardElement.querySelector('.card__image').alt = cardData.name; //добавили альт
    cardElement.querySelector('.card__image').src = cardData.link; //добавили ссылку
    const deleteButton = cardElement.querySelector('.card__delete-button'); //выбрали иконку удаления карточки
    const likeButton = cardElement.querySelector('.card__like-button');//кнопка лайка
    
    cardElement.querySelector('.card__image').addEventListener('click', function(){ //слушатель открытия попапа картинки
        openPopupTypeImage(cardData.link, cardData.name);
    });

    likeButton.addEventListener('click', likeHandler);//слушатель лайка
    deleteButton.addEventListener('click', deletHandler); //повесили слушатель события удаления карточки на иконку

    return cardElement; //результат работы функции - возвращение клонированной разметки
}

function addCard (cardElement){
    placesItem.append(cardElement); //новая функция добавляет карточку в DOM
}

// @todo: Функция удаления карточки
function deleteCard (event){
    const listCard = event.target.closest('.card');
    listCard.remove();
}

// @todo: Вывести карточки на страницу
function renderCards(){ //функция отрисовки карточек из массива
    initialCards.forEach (cardData => {
    const cardElement = createCard (cardData, deleteCard, likeCards); //результат работы функции createCard помещаем в переменную для последующего добавления в DOM addCard (cardElement);
    addCard(cardElement); //вызываем функцию добавления карточки в DOM
});
}

renderCards ();

// 6 спринт

const profileEditButton = document.querySelector('.profile__edit-button'); //кнопка редактирования профиля
const placeAddButton = document.querySelector('.profile__add-button'); // кнопка добавления карточки

const popupTypeEdit = document.querySelector('.popup_type_edit'); //попап редактирования профиля
const popupNewCard = document.querySelector('.popup_type_new-card'); //попап новой карточки
const popupTypeImage = document.querySelector('.popup_type_image'); //попап картинки

const closePopupButtons = document.querySelectorAll('.popup__close'); // кнопки закрытия

const profileForm = document.forms['edit-profile']; //форма редактирования профиля

const profileName = document.querySelector('.profile__title'); //имя на странице
const profileJob = document.querySelector('.profile__description'); //профессия на странице

const inputName = profileForm.querySelector('.popup__input_type_name'); //инпут имени
const inputJob = profileForm.querySelector('.popup__input_type_description'); //инпут профессии

const cardsForm = document.forms['new-place']; //форма добавления карточки

const inputPlace = cardsForm.querySelector('.popup__input_type_card-name'); //инпут имени места
const inputLink = cardsForm.querySelector('.popup__input_type_url'); //инпут ссылки места

//открытие попапа редактирования профиля
function openPopupTypeEdit() {
    inputName.value = profileName.textContent;
    inputJob.value = profileJob.textContent;
    openPopups(popupTypeEdit);
};

profileEditButton.addEventListener('click', openPopupTypeEdit); // слушатель открытия попапа редактирования профиля

//открытие попапа создания новой карточки
function openPopupNewCard() {
    openPopups(popupNewCard);
}

placeAddButton.addEventListener('click', openPopupNewCard); //слушатель попапа создания новой карточки

//функция открытия попапа изображения
function openPopupTypeImage(imageSrc, imageTitle) {
    const img = popupTypeImage.querySelector('.popup__image');
    const title = popupTypeImage.querySelector('.popup__caption');

    img.src = imageSrc;
    img.alt = imageTitle;
    title.textContent = imageTitle;

    openPopups(popupTypeImage);
};

//открытие любого попапа
function openPopups(popup) {
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', closePopupsEsc);//добавить слушатель закрытия попапа на esc
}

//закрытие любого попапа
function closePopups(popup) {
    popup.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', closePopupsEsc);//убрать слушатель закрытия попапа на esc
};

//закрытие попапа на оверлей
function closePopupsOverlay(evt) {
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

//на каждой кнопке закрытия попапа вызвать функцию закрытия попапа
closePopupButtons.forEach(function(item) {
    const parent = item.closest('.popup');
    item.addEventListener('click', () => closePopups(parent));
    parent.addEventListener('click', closePopupsOverlay);//слушатель закрытия на оверлей
})

//лайк
function likeCards (evt) {
    evt.target.classList.toggle('card__like-button_is-active');
}

//функция работы с сабмитом редактирования профиля
function handleFormSubmit(evt) {
    evt.preventDefault();

    profileName.textContent = inputName.value;
    profileJob.textContent = inputJob.value;

    closePopups(popupTypeEdit);
};

profileForm.addEventListener('submit', handleFormSubmit); //слушатель события сабмита для редактирования профиля


//добавление новой карточки
function addNewCards(cardData, deletHandler, likeHandler) {
    const newCard = createCard (cardData, deletHandler, likeHandler);
    placesItem.prepend(newCard);
}

//функция работы с сабмитом новой карточки
function newCardFormSubmit(evt) {
    evt.preventDefault();

    const objNewCard = {
        name: inputPlace.value,
        link: inputLink.value
    }

    addNewCards(objNewCard, deleteCard, likeCards);
    closePopups(popupNewCard);

    cardsForm.reset();
};

cardsForm.addEventListener('submit', newCardFormSubmit);