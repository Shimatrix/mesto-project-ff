import {templateCards} from '../pages/index.js'

export function createCard (cardData, deletHandler, likeHandler, imageClickHandler){
    const cardElement = templateCards.querySelector ('.card').cloneNode(true); //клонировали свойство темплейта
    cardElement.querySelector('.card__title').textContent = cardData.name; //добавили название карточки
    cardElement.querySelector('.card__image').alt = cardData.name; //добавили альт из аргумента
    cardElement.querySelector('.card__image').src = cardData.link; //добавили ссылку из аргумента
    const deleteButton = cardElement.querySelector('.card__delete-button'); //выбрали кнопку удаления карточки
    const likeButton = cardElement.querySelector('.card__like-button'); //кнопка лайка
    
    cardElement.querySelector('.card__image').addEventListener('click', function(){ //слушатель открытия попапа картинки
        imageClickHandler(cardData.link, cardData.name);
    });

    likeButton.addEventListener('click', likeHandler);//слушатель лайка
    deleteButton.addEventListener('click', deletHandler); //слушатель события удаления карточки на иконку

    return cardElement; //результат работы функции это возвращение клонированной разметки
}

//Функция удаления карточки
export function deleteCard (event){
    const listCard = event.target.closest('.card');
    listCard.remove();
}

//лайк
export function likeCards (evt) {
    evt.target.classList.toggle('card__like-button_is-active');
}