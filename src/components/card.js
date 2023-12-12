import {templateCards} from '../pages/index.js'

import {deleteCardByServer, deteleLikeByServer, getLikeByServer} from '../components/api.js';

export function createCard (cardData, deletHandler, likeHandler, imageClickHandler, userId){
    const cardElement = templateCards.querySelector ('.card').cloneNode(true); //клонировали свойство темплейта
    const deleteButton = cardElement.querySelector('.card__delete-button'); //выбрали кнопку удаления карточки
    const likeButton = cardElement.querySelector('.card__like-button'); //кнопка лайка
    const likeNumber = cardElement.querySelector('.card__like-number');//спан с счетчиком лайков
    const isLikedByMe = cardData.likes.some((like) => like._id === userId);
    const cardImage = cardElement.querySelector('.card__image');

    cardElement.querySelector('.card__title').textContent = cardData.name; //добавили название карточки
    likeNumber.textContent = cardData.likes.length;
    cardImage.alt = cardData.name; //добавили альт из аргумента
    cardImage.src = cardData.link; //добавили ссылку из аргумента

    if (likeHandler) {
        likeButton.addEventListener('click', () => {
            likeHandler(cardData._id, likeNumber, likeButton)
        });
    }

    if (imageClickHandler) {
        cardImage.addEventListener('click', () => {
            imageClickHandler(cardData)
        })
    }

    if (isLikedByMe) {
        likeButton.classList.add('card__like-button_is-active');
    }

    if (cardData.owner._id !== userId) {
        deleteButton.remove();
    } else {
        deleteButton.addEventListener('click', () => {
            deletHandler(cardData._id, cardElement, deletHandler)
        }); //слушатель события удаления карточки на иконку
    }

    return cardElement; //результат работы функции это возвращение клонированной разметки
}

export function deleteCard (cardId, cardElement) {
    deleteCardByServer(cardId)
    .then(() => {
        cardElement.remove()
    })
    .catch((errorApi) => {
        console.log(`Ой, ошибка: ${errorApi.status}`);
    })
}

//лайк
export function likeCards (cardId, likeNumber, likeButton) {
    const liked = likeButton.classList.contains('card__like-button_is-active');
    const likeMethod = liked ? deteleLikeByServer : getLikeByServer;
        likeMethod(cardId) 
        .then((newCardData) => { 
            likeNumber.textContent = newCardData.likes.length; 
            likeButton.classList.toggle('card__like-button_is-active'); 
        }) 
        .catch((errorApi) => { 
            console.log(`Ой, ошибка: ${errorApi.status}`); 
        })
}