import { authHeader } from '../helpers';

const config = {
    apiUrl: 'http://localhost:3000',
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/messages`, requestOptions).then(handleResponse);
}

function sendMessage(userId, message) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ userId, message })
    };

    return fetch(`${config.apiUrl}/message`, requestOptions)
        .then(handleResponse)
        .then(message => {
            return message;
        });
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}

export const chatService = {
    getAll,
    sendMessage,
};