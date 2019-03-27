'use strict';

$(function () {
    const $gallery = $('#gallery');
    const randomUserAPI = 'https://randomuser.me/api';
    const apiOption = {results: 12, nat: 'US'};

    $.getJSON(randomUserAPI, apiOption, (data) => {
        const users = data.results || [];

        users.forEach(user => {
            const $userTemplate = $(createUserTemplate(user));

            $userTemplate.data('user', user);
            $gallery.append($userTemplate);
        });
    });

    $gallery.on('click', '.card', e => {
        showUserModal($(e.currentTarget));
    });

    addSearchComponent();
});

/**
 * Create user markup template
 * 
 * @param {Object} user
 * @returns {string} Markup template
 */
function createUserTemplate(user) {
    return `
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${user.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="card-text">${user.email}</p>
                <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
            </div>
        </div>`;
}

/**
 * Show user details modal
 * 
 * @param {Object} $userCard Current user card
 */
function showUserModal($userCard) {
    const user = $userCard.data('user');
    const getUserInfoMarkup = user => {
        return `
            <img class="modal-img" src="${user.picture.large}" alt="profile picture">
            <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="modal-text">${user.email}</p>
            <p class="modal-text cap">${user.location.city}</p>
            <hr>
            <p class="modal-text">${user.phone}</p>
            <p class="modal-text">${user.location.street}, ${user.location.state}, ${user.location.postcode}</p>
            <p class="modal-text">Birthday: ${new Date(user.dob.date).toLocaleDateString()}</p>`;
    };
    const $modal = $(`
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container"></div>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `);

    $modal.find('.modal-info-container').html(getUserInfoMarkup(user));

    $modal.on('click', '#modal-close-btn', e => {
        $modal.remove();
    });

    $modal.on('click', '#modal-prev', e => {
        const $prevUserCard = $userCard.prev('.card');
        
        if ($prevUserCard.length > 0) {
            $userCard = $prevUserCard;
            $modal.find('.modal-info-container').html(getUserInfoMarkup($userCard.data('user')));
        }
    });

    $modal.on('click', '#modal-next', e => {
        const $nextUserCard = $userCard.next('.card');

        if ($nextUserCard.length > 0) {
            $userCard = $nextUserCard;
            $modal.find('.modal-info-container').html(getUserInfoMarkup($userCard.data('user')));
        }
    });

    $('body').append($modal);
}

/**
 * Add search component for employee directory
 */
function addSearchComponent() {
    const $gallery = $('#gallery');
    const $searchComponent = $(`
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
        </form>
    `);

    $searchComponent.find('#search-input').on('keyup', e => {
        const value = $(e.target).val() || '';
        const regExp = new RegExp(value, 'ig');

        $gallery.find('.card').each((index, card) => {
            const $card = $(card);
            const name = $card.find('#name').text();
           
            if (regExp.test(name)) {
                $card.show();
            } else {
                $card.hide();
            }
        });
    });

    $searchComponent.find('#serach-submit').on('click', e => {
        e.preventDefault();
        $searchComponent.find('#search-input').trigger('click');
    });

    $('.search-container').append($searchComponent);
}
