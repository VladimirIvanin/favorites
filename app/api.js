// Helper function to get language parameter
function getLang() {
  return new URLSearchParams(window.location.search).get('lang') || '';
}

// Helper function for making API requests
async function makeRequest(url, method, data = null) {
  const self = this;
  
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    self.logger(`Запрос ${method} к ${url} выполнен успешно`, result);
    return result;
  } catch (error) {
    self.logger(`Ошибка при выполнении ${method} запроса к ${url}`, error);
    throw error;
  }
}

export async function getFavorites() {
  const self = this;
  try {
    const lang = getLang();
    const requestUrl = `${window.location.origin}/front_api/favorites.json`;
    
    let path = new URL(requestUrl);
    if (lang) {
      path.searchParams.set('lang', lang);
    }
    
    return await makeRequest.call(self, path.toString(), 'GET');
  } catch (error) {
    self.logger('Не удалось получить избранное с сервера', error);
    return {};
  }
}

// Сохранить товар в избранное на сервере
export async function setFavorites(productId) {
  const lang = getLang();
  const fields = {
    lang: lang,
    product: {
      id: parseInt(productId)
    }
  };
  
  try {
    return await makeRequest.call(this, '/front_api/favorites.json', 'POST', fields);
  } catch (error) {
    this.logger('Не удалось добавить товар в избранное на сервере', error);
    throw error;
  }
}

// Удалить товар из избранного на сервере
export async function removeFavorite(productId) {
  const lang = getLang();
  const fields = { lang: lang };
  
  try {
    return await makeRequest.call(this, `/front_api/favorites/${parseInt(productId)}.json`, 'DELETE', fields);
  } catch (error) {
    this.logger('Не удалось удалить товар из избранного на сервере', error);
    throw error;
  }
}
