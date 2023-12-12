
const apiConfig = {
  url: 'https://mesto.nomoreparties.co/v1/wff-cohort-2',
  headers: {
    authorization: '3f23af9a-e36a-4838-8183-c4f1f1a53fd9',
    'Content-Type': 'application/json'
  }
}

//проверяет ошибку запроса апи
const checkApi = (res) => {
  if (res.ok) {
    return res.json()
  } else {
    return Promise.reject(`Ой, ошибка: ${res.status}`)
  }
}

//получаем инфу о пользователе
export const getInfoProfile = () => {
  return fetch(`${apiConfig.url}/users/me`, {
    method: 'GET',
    headers: apiConfig.headers
  })
  .then(checkApi)
}

//получаем массив карточек 
export const getCards = () => {
  return fetch(`${apiConfig.url}/cards`, {
    method: 'GET',
    headers: apiConfig.headers
  })
  .then(res => checkApi(res))
}

//отправить инфу о пользователе на сервер
export const pushInfoUser = (newName, newJob) => {
  return fetch(`${apiConfig.url}/users/me`, {
    method: 'PATCH',
    headers: apiConfig.headers,
    body: JSON.stringify({
      name: newName,
      about: newJob
    })
  })
  .then(res => checkApi(res))
}

//отправить новую карточку на сервер
export const addCardByServer = (cardData) => {
  return fetch(`${apiConfig.url}/cards`, {
    method: 'POST',
    headers: apiConfig.headers,
    body: JSON.stringify(cardData)
  })
  .then(res => checkApi(res))
}

//удалить карточку с сервера
export const deleteCardByServer = (cardId) => {
  return fetch(`${apiConfig.url}/cards/${cardId}`, {
    method: 'DELETE',
    headers: apiConfig.headers
  })
  .then(res => checkApi(res))
}

//функция постановки лайков
export const getLikeByServer = (cardId) => {
  return fetch(`${apiConfig.url}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: apiConfig.headers
  })
  .then(res => checkApi(res))
}

//функция удаления лайков
export const deteleLikeByServer = (cardId) => {
  return fetch(`${apiConfig.url}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: apiConfig.headers
  })
  .then(res => checkApi(res))
}

//функция обновления аватара
export const getNewAvatar = (avatarData) => {
  return fetch(`${apiConfig.url}/users/me/avatar`, {
    method: 'PATCH',
    headers: apiConfig.headers,
    body: JSON.stringify(avatarData)
  })
  .then(res => checkApi(res))
}