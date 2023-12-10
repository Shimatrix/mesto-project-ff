import './index.css';
import {createCard, deleteCard, likeCards} from '../components/card.js';
import {openPopups, closePopups, closePopupsOverlay} from '../components/modal.js';

import {enableValidation, clearValidation} from '../components/validation.js'

import {getInfoProfile, getCards, pushInfoUser, addCardByServer, getNewAvatar} from '../components/api.js';

// Вызовем функцию валидации
enableValidation({
    formSelector: ".popup__form",
    inputSelector: ".popup__input",
    submitButtonSelector: ".popup__button",
    inactiveButtonClass: "popup__button_disabled",
    inputErrorClass: "popup__input_type_error",
    errorClass: "popup__error_visible"
  });
  
export const templateCards = document.querySelector('#card-template').content; //помещаем темплейт в переменную
const placesItem = document.querySelector('.places__list'); //сохраняем новую карточку в список (ul)

const profileEditButton = document.querySelector('.profile__edit-button'); //кнопка редактирования профиля
const placeAddButton = document.querySelector('.profile__add-button'); // кнопка добавления карточки

const popupTypeEdit = document.querySelector('.popup_type_edit'); //попап редактирования профиля
const popupNewCard = document.querySelector('.popup_type_new-card'); //попап новой карточки
export const popupTypeImage = document.querySelector('.popup_type_image'); //попап картинки
const popupEditAvatar = document.querySelector('.popup_type_new-avatar');//попап нового аватара

const avatarForm = document.forms['new-avatar'];//форма нового аватара
const inputAvatarLink = avatarForm.querySelector('.popup__input_type_avatar-url');
const buttonEditAvatar = document.querySelector('.profile__edit-avatar');

const closePopupButtons = document.querySelectorAll('.popup__close'); // ВСЕ кнопки закрытия попапов

const profileForm = document.forms['edit-profile']; //форма редактирования профиля

const profileName = document.querySelector('.profile__title'); //имя на странице
const profileJob = document.querySelector('.profile__description'); //профессия на странице
const avatarProfile = document.querySelector('.profile__image');

const inputName = profileForm.querySelector('.popup__input_type_name'); //инпут имени
const inputJob = profileForm.querySelector('.popup__input_type_description'); //инпут профессии

const cardsForm = document.forms['new-place']; //форма добавления карточки

const inputPlace = cardsForm.querySelector('.popup__input_type_card-name'); //инпут имени места
const inputLink = cardsForm.querySelector('.popup__input_type_url'); //инпут ссылки места

const buttonAvatarSave = avatarForm.querySelector('.popup__button'); //кнопка сохранения для аватара
const buttonProfileSave = profileForm.querySelector('.popup__button'); //кнопка сохранения для профиля
const buttonCardSave = cardsForm.querySelector('.popup__button'); //кнопка сохранения для новой карточки

const img = popupTypeImage.querySelector('.popup__image'); 
const title = popupTypeImage.querySelector('.popup__caption');

let userId;

//добавляем карточку в DOM
function addCard (cardElement){
    placesItem.append(cardElement);
}

function renderUserInfo(infoProfileData) {
    profileName.textContent = infoProfileData.name;
    profileJob.textContent = infoProfileData.about;
    avatarProfile.style.backgroundImage = `url(${infoProfileData.avatar})`;
}

//Вывести карточки на страницу
function renderCards(cardsData) { //отрисовка карточек из массива
    cardsData.forEach(cardData => {
        const cardElement = createCard(cardData, deleteCard, likeCards, openPopupTypeImage, userId);
        addCard(cardElement); //вызываем функцию для добавления карточки в DOM
    })
}

//открытие попапа редактирования профиля
function openPopupTypeEdit() {
    clearValidation(profileForm, {
        formSelector: ".popup__form",
        inputSelector: ".popup__input",
        submitButtonSelector: ".popup__button",
        inactiveButtonClass: "popup__button_disabled",
        inputErrorClass: "popup__input_type_error",
        errorClass: "popup__error_visible"
      }); 
    inputName.value = profileName.textContent; //присваиваем свойства инпутов в текст разметки
    inputJob.value = profileJob.textContent; //присваиваем свойства инпутов в текст разметки
    openPopups(popupTypeEdit);
};

//открытие попапа создания новой карточки
function openPopupNewCard() {
    clearValidation(cardsForm, {
        formSelector: ".popup__form",
        inputSelector: ".popup__input",
        submitButtonSelector: ".popup__button",
        inactiveButtonClass: "popup__button_disabled",
        inputErrorClass: "popup__input_type_error",
        errorClass: "popup__error_visible"
      }); 
    openPopups(popupNewCard);
}

//функция открытия попапа изображения
function openPopupTypeImage(cardData) {
    img.src = cardData.link; //в ссылку картинки присваиваем ссылку из аргумента
    img.alt = cardData.name; //в альт помещаем название картинки из аргумента
    title.textContent = cardData.name; //в текст под картинкой вставляем аргумент с названием 

    openPopups(popupTypeImage);
};

//на каждой кнопке закрытия попапа вызвать функцию закрытия попапа
closePopupButtons.forEach(function(item) {
    const parent = item.closest('.popup');
    item.addEventListener('click', () => closePopups(parent));
    parent.addEventListener('click', closePopupsOverlay);//слушатель закрытия на оверлей
})

function openPopupEditAvatar() {
    clearValidation(avatarForm, {
        formSelector: ".popup__form",
        inputSelector: ".popup__input",
        submitButtonSelector: ".popup__button",
        inactiveButtonClass: "popup__button_disabled",
        inputErrorClass: "popup__input_type_error",
        errorClass: "popup__error_visible"
      });
    openPopups(popupEditAvatar);
}

//функция работы с сабмитом редактирования профиля
function submitEditProfileForm(evt) {
    evt.preventDefault();

    buttonProfileSave.textContent = 'Сохранение...';

    const newName = inputName.value;
    const newJob = inputJob.value;

    pushInfoUser(newName, newJob)
    .then(() => {
        profileName.textContent = newName;
        profileJob.textContent = newJob;
        closePopups(popupTypeEdit);

        clearValidation(profileForm, {
            formSelector: ".popup__form",
            inputSelector: ".popup__input",
            submitButtonSelector: ".popup__button",
            inactiveButtonClass: "popup__button_disabled",
            inputErrorClass: "popup__input_type_error",
            errorClass: "popup__error_visible"
          }); 
    })
    .catch((errorApi) => {
        console.log(`Ой, ошибка: ${errorApi.status}`);
    })
    .finally(() => {
        buttonProfileSave.textContent = 'Сохранить'
    })
};

//добавление новой карточки
function addNewCards(cardData, deletHandler, likeHandler, imageClickHandler, userId) {
    const newCard = createCard (cardData, deletHandler, likeHandler, imageClickHandler, userId);
    placesItem.prepend(newCard);
}

//функция работы с сабмитом новой карточки
function submitAddCardForm(evt) {
    evt.preventDefault();

    buttonCardSave.textContent = 'Сохранение...';

    const cardDataNew = {
        name: inputPlace.value,
        link: inputLink.value
    }

    addCardByServer(cardDataNew)
    .then((newCardData) => {
        addNewCards(newCardData, deleteCard, likeCards, openPopupTypeImage, userId);

        closePopups(popupNewCard);

        cardsForm.reset();
        clearValidation(cardsForm, validationConfig);
    })
    .catch((errorApi) => {
        console.log(`Ой, ошибка: ${errorApi.status}`);
    })
    .finally(() => {
        buttonCardSave.textContent = 'Сохранить'
    })
};

function submitNewAvatar(evt) {
    evt.preventDefault();

    buttonAvatarSave.textContent = 'Сохранение...';

    const avatarData = {
        avatar: inputAvatarLink.value
    }

    getNewAvatar(avatarData)
    .then(() => {
        avatarProfile.style.backgroundImage = `url(${inputAvatarLink.value})`;
        closePopups(popupEditAvatar);

        avatarForm.reset();
        clearValidation(avatarForm, validationConfig);
    })
    .catch((errorApi) => {
        console.log(`Ой, ошибка: ${errorApi.status}`);
    })
    .finally(() => {
        buttonAvatarSave.textContent = 'Сохранить'
    })
}

cardsForm.addEventListener('submit', submitAddCardForm); //слушатель формы отправки сабмита новой карточки
placeAddButton.addEventListener('click', openPopupNewCard); //слушатель попапа создания новой карточки
profileForm.addEventListener('submit', submitEditProfileForm); //слушатель события сабмита для редактирования профиля
profileEditButton.addEventListener('click', openPopupTypeEdit); // слушатель открытия попапа редактирования профиля
avatarForm.addEventListener('submit', submitNewAvatar) //слушатель отправки формы нового аватара
buttonEditAvatar.addEventListener('click', openPopupEditAvatar); //слушатель открытия попапа картинки

Promise.all([getInfoProfile(), getCards()])
.then(([infoProfileData, cardsData]) => {
    renderUserInfo(infoProfileData);
    userId = infoProfileData._id;
    renderCards(cardsData);
    console.log(infoProfileData, cardsData);
})
.catch((errorApi) => {
    console.log(`Ой, ошибка: ${errorApi.status}`);
})