import {templateCards} from '../pages/index.js'

import {deleteCardByServer, deteleLikeByServer, getLikeByServer} from '../components/api.js';

export function createCard (cardData, deletHandler, likeHandler, imageClickHandler, userId){
    const cardElement = templateCards.querySelector ('.card').cloneNode(true); //клонировали свойство темплейта
    const deleteButton = cardElement.querySelector('.card__delete-button'); //выбрали кнопку удаления карточки
    const likeButton = cardElement.querySelector('.card__like-button'); //кнопка лайка
    const likeNumber = cardElement.querySelector('.card__like-number');//спан с счетчиком лайков
    const whoIsLiked = cardData.likes.some((like) => like._id === userId);
    const cardImage = cardElement.querySelector('.card__image');

    cardElement.querySelector('.card__title').textContent = cardData.name; //добавили название карточки
    likeNumber.textContent = cardData.likes.length;
    cardImage.alt = cardData.name; //добавили альт из аргумента
    cardImage.src = cardData.link; //добавили ссылку из аргумента
    
    // cardElement.querySelector('.card__image').addEventListener('click', function(){ //слушатель открытия попапа картинки
    //     imageClickHandler(cardData.link, cardData.name);
    // });

    // likeButton.addEventListener('click', likeHandler);//слушатель лайка

    if (deletHandler) {
        deleteButton.addEventListener('click', () => {
            // const cardElement = event.target.closest('.card');
            // const cardId = cardElement.dataset.cardId;

            deletHandler(cardData._id, cardElement, deletHandler)
        }); //слушатель события удаления карточки на иконку
    }

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

    if (whoIsLiked) {
        likeButton.classList.add('card__like-button_is-active');
    }

    if (cardData.owner._id !== userId) {
        deleteButton.remove();
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
    // evt.target.classList.toggle('card__like-button_is-active');
    const liked = likeButton.classList.contains('card__like-button_is-active');
    if (liked) {
        deteleLikeByServer(cardId)
        .then((newCardData) => {
            likeNumber.textContent = newCardData.likes.length;
            likeButton.classList.remove('card__like-button_is-active');
        })
        .catch((errorApi) => {
            console.log(`Ой, ошибка: ${errorApi.status}`);
        })
    } else {
        getLikeByServer(cardId)
        .then((newCardData) => {
            likeNumber.textContent = newCardData.likes.length;
            likeButton.classList.add('card__like-button_is-active');
        })
        .catch((errorApi) => {
            console.log(`Ой, ошибка: ${errorApi.status}`);
        })
    }
}