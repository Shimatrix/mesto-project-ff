import './index.css';
import {initialCards} from '../scripts/constants.js';
import {createCard, deleteCard, likeCards} from '../components/card.js';
import {openPopups, closePopups, closePopupsOverlay} from '../components/modal.js';

export const templateCards = document.querySelector('#card-template').content; //помещаем темплейт в переменную
const placesItem = document.querySelector('.places__list'); //сохраняем новую карточку в список (ul)

const profileEditButton = document.querySelector('.profile__edit-button'); //кнопка редактирования профиля
const placeAddButton = document.querySelector('.profile__add-button'); // кнопка добавления карточки

const popupTypeEdit = document.querySelector('.popup_type_edit'); //попап редактирования профиля
const popupNewCard = document.querySelector('.popup_type_new-card'); //попап новой карточки
export const popupTypeImage = document.querySelector('.popup_type_image'); //попап картинки

const closePopupButtons = document.querySelectorAll('.popup__close'); // ВСЕ кнопки закрытия попапов

const profileForm = document.forms['edit-profile']; //форма редактирования профиля

const profileName = document.querySelector('.profile__title'); //имя на странице
const profileJob = document.querySelector('.profile__description'); //профессия на странице

const inputName = profileForm.querySelector('.popup__input_type_name'); //инпут имени
const inputJob = profileForm.querySelector('.popup__input_type_description'); //инпут профессии

const cardsForm = document.forms['new-place']; //форма добавления карточки

const inputPlace = cardsForm.querySelector('.popup__input_type_card-name'); //инпут имени места
const inputLink = cardsForm.querySelector('.popup__input_type_url'); //инпут ссылки места

const img = popupTypeImage.querySelector('.popup__image'); 
const title = popupTypeImage.querySelector('.popup__caption');

//добавляем карточку в DOM
function addCard (cardElement){
    placesItem.append(cardElement);
}

//Вывести карточки на страницу
function renderCards(){ //отрисовка карточек из массива
    initialCards.forEach (cardData => {
    const cardElement = createCard (cardData, deleteCard, likeCards, openPopupTypeImage); //результат работы функции createCard помещаем в переменную для последующего добавления в DOM
    addCard(cardElement); //вызываем функцию для добавления карточки в DOM
});
}

renderCards ();

//открытие попапа редактирования профиля
function openPopupTypeEdit() {
    inputName.value = profileName.textContent; //присваиваем свойства инпутов в текст разметки
    inputJob.value = profileJob.textContent; //присваиваем свойства инпутов в текст разметки
    openPopups(popupTypeEdit);
};

//открытие попапа создания новой карточки
function openPopupNewCard() {
    openPopups(popupNewCard);
}

//функция открытия попапа изображения
function openPopupTypeImage(imageSrc, imageTitle) {
    img.src = imageSrc; //в ссылку картинки присваиваем ссылку из аргумента
    img.alt = imageTitle; //в альт помещаем название картинки из аргумента
    title.textContent = imageTitle; //в текст под картинкой вставляем аргумент с названием 

    openPopups(popupTypeImage);
};

//на каждой кнопке закрытия попапа вызвать функцию закрытия попапа
closePopupButtons.forEach(function(item) {
    const parent = item.closest('.popup');
    item.addEventListener('click', () => closePopups(parent));
    parent.addEventListener('click', closePopupsOverlay);//слушатель закрытия на оверлей
})

//функция работы с сабмитом редактирования профиля
function submitEditProfileForm(evt) {
    evt.preventDefault();

    profileName.textContent = inputName.value;
    profileJob.textContent = inputJob.value;

    closePopups(popupTypeEdit);
};

//добавление новой карточки
function addNewCards(cardData, deletHandler, likeHandler) {
    const newCard = createCard (cardData, deletHandler, likeHandler);
    placesItem.prepend(newCard);
}

//функция работы с сабмитом новой карточки
function submitAddCardForm(evt) {
    evt.preventDefault();

    const cardData = {
        name: inputPlace.value,
        link: inputLink.value
    }

    addNewCards(cardData, deleteCard, likeCards);
    closePopups(popupNewCard);

    cardsForm.reset();
};

cardsForm.addEventListener('submit', submitAddCardForm); //слушатель формы отправки сабмита новой карточки
placeAddButton.addEventListener('click', openPopupNewCard); //слушатель попапа создания новой карточки
profileForm.addEventListener('submit', submitEditProfileForm); //слушатель события сабмита для редактирования профиля
profileEditButton.addEventListener('click', openPopupTypeEdit); // слушатель открытия попапа редактирования профиля