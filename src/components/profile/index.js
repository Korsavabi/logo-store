import mainContainerTemplate from '../../templates/profile-main-template.hbs';
import profileContactsTemplate from '../../templates/profile-contacts-template.hbs';
import profileChangepasswordTemplate from '../../templates/profile-changepassword-template.hbs';
import profileAddressTemplate from '../../templates/profile-address-template.hbs';
import services from '../services/index.js';

const mainContainer = document.querySelector('.main-container');

// Функция выхода из меню личный кабинет, затирает токен и вызывает функцию рендеринга главной страницы:
// const clearAuthenticationToken = () => {
//   localStorage.removeItem('');
// };

// Функция, которая проверяет есть ли класс активного меню, для подсвечивания активного пункта меню:
const changeActiveItem = element => {
  const activeItem = document.querySelector('.profile-menu__item_active');
  if (activeItem !== null) {
    activeItem.classList.remove('profile-menu__item_active');
  }

  element.classList.add('profile-menu__item_active');
};

// Функция, которая собирает значения с формы и создает объект для отправки на бекенд:
const buildRequestObject = event => {
  const formRef = event.target;
  const formData = new FormData(formRef);
  const submittedData = {};

  // Записываю в объект название и значение полей формы:
  formData.forEach((value, key) => {
    submittedData[key] = value;
  });
  console.log(submittedData);
  return submittedData;
};

// Функция, которая генерирует сообщение нотификацию на форме меню личный кабинет:
const notificationMessage = (elem, message) => {
  const oldSpan = document.querySelector('.notification');
  if (oldSpan !== null) {
    oldSpan.remove();
  }
  let span = document.createElement('span');
  span.classList.add('notification');
  span.textContent = message;
  elem.before(span);
};
/**
 * Функция может принимать три значения: personalProfile, favorites, createAd,
 * в зависимости от того с какой кнопки осуществляется переход;
 */
const renderProfile = source => {
  // Отрисовываю меню:
  mainContainer.insertAdjacentHTML('beforeend', mainContainerTemplate());

  // Нахожу контейнер, в который буду отрисовывать пункты меню личный кабинет:
  const profileSectionsDetails = document.querySelector(
    '.profile-sections__details',
  );

  // Нахожу пункт меню "Контакты":
  const profileMenuItemContacts = document.querySelector(
    '.profile-menu__item_contacts',
  );

  // Нахожу пукт меню "Изменить пароль" :
  const profileMenuItemChangePassword = document.querySelector(
    '.profile-menu__item_change-password',
  );

  // Нахожу пукт меню "Мой адрес" :
  const profileMenuItemAddress = document.querySelector(
    '.profile-menu__item_address',
  );

  // Отрисовываю детали меню "Контакты":
  const renderContacts = async () => {
    profileMenuItemContacts.after(profileSectionsDetails);
    profileSectionsDetails.insertAdjacentHTML(
      'beforeend',
      profileContactsTemplate(),
    );

    changeActiveItem(profileMenuItemContacts);

    // Вызываю API (функция getCurrentUser) для заполнения деталей меню "Контакты":
    const result = await services.getCurrentUser();
    console.log(result);

    // Нахожу форму деталей меню "Контакты":
    const contactsForm = document.querySelector('.contacts-form');

    // Заполняю форму деталей меню "Контакты" значениями:
    contactsForm.elements.name.value = result.name;
    contactsForm.elements.surname.value = result.surname;
    contactsForm.elements.email.value = result.email;
    contactsForm.elements.phone.value = result.phone;

    // Вешаю слушателя на форму деталей меню "Контакты":
    contactsForm.addEventListener('submit', async event => {
      event.preventDefault();

      // Вызываю API (функция changeUserInfo) для изменения данных из меню "Контакты":
      const response = await services.changeUserInfo(buildRequestObject(event));
      console.log(response);

      if (response.status >= 200 && response.status < 300) {
        notificationMessage(contactsForm, 'Данные успешно сохранены!');
      }

      if (response.status >= 400) {
        const errorMessage = await response.text();
        notificationMessage(contactsForm, errorMessage);
      }
    });
  };

  // Вешаю слушателя на пункт меню "Контакты":
  profileMenuItemContacts.addEventListener('click', event => {
    event.preventDefault();
    profileSectionsDetails.innerHTML = '';

    // Вызываю функцию для вызова API (функция getCurrentUser) чтобы заполнить детали меню "Контакты":
    renderContacts();
  });

  // Вешаю слушателя на пункт меню "Изменить пароль":
  profileMenuItemChangePassword.addEventListener('click', event => {
    event.preventDefault();
    profileSectionsDetails.innerHTML = '';

    // Отрисовываю детали меню "Изменить пароль":
    profileMenuItemChangePassword.after(profileSectionsDetails);
    profileSectionsDetails.insertAdjacentHTML(
      'beforeend',
      profileChangepasswordTemplate(),
    );

    changeActiveItem(profileMenuItemChangePassword);

    // Нахожу форму деталей меню "Изменить пароль":
    const changePasswordForm = document.querySelector('.changepassword-form');

    // Вешаю слушателя на форму деталей меню "Изменить пароль":
    changePasswordForm.addEventListener('submit', async event => {
      event.preventDefault();

      const newPassword = changePasswordForm.elements.password.value;
      const confirmPassword = changePasswordForm.elements.confirmPassword.value;

      if (newPassword === confirmPassword) {
        // Вызываю API (функция changePassword) для изменения данных из меню "Контакты":

        const response = await services.changePassword(
          buildRequestObject(event),
        );
        if (response.status >= 200 && response.status < 300) {
          console.log(response);
          notificationMessage(changePasswordForm, 'Пароль успешно сохранен!');
        }
        if (response.status >= 400) {
          const errorMessage = await response.text();
          console.log(errorMessage);
          notificationMessage(changePasswordForm, errorMessage);
        }
      } else {
        notificationMessage(changePasswordForm, 'Пароли должны совпадать!');
      }
    });
  });

  // Отрисовываю детали меню "Мой адрес":
  const renderAddress = async () => {
    profileMenuItemAddress.after(profileSectionsDetails);
    profileSectionsDetails.insertAdjacentHTML(
      'beforeend',
      profileAddressTemplate(),
    );

    changeActiveItem(profileMenuItemAddress);

    // Вызываю API (функция getCurrentUser) для заполнения деталей меню "Мой адрес":
    const result = await services.getCurrentUser();
    console.log(result);

    // Нахожу форму деталей меню "Мой адрес":
    const addressForm = document.querySelector('.address-form');

    // Заполняю форму деталей меню "Мой адрес" значениями:
    addressForm.elements.name.value = result.name;
    addressForm.elements.surname.value = result.surname;
    addressForm.elements.country.value = result.address.country;

    addressForm.elements.place.value = result.address.place;
    addressForm.elements.city.value = result.address.city;
    addressForm.elements.street.value = `${result.address.street}, ${result.address.building}, ${result.address.flat}`;

    // Вешаю слушателя на форму деталей меню "Мой адрес":
    addressForm.addEventListener('submit', async event => {
      event.preventDefault();

      let { country, city, place, street } = buildRequestObject(event);

      const splitAddress = street.split(',');
      // console.log(splitAddress);
      // Вызываю API (функция changeUserAddress) для изменения данных из меню "Мой адрес":
      const response = await services.changeUserAddress({
        country,
        city,
        place,
        street: splitAddress[0],
        building: splitAddress[1],
        flat: splitAddress[2],
      });
      if (response.status >= 200 && response.status < 300) {
        console.log(response);
        notificationMessage(addressForm, 'Адрес успешно сохранён!');
      }
      if (response.status >= 400) {
        const errorMessage = await response.text();
        console.log(errorMessage);
        notificationMessage(addressForm, errorMessage);
      }
    });
  };

  // Вешаю слушателя на пункт меню "Мой адрес":
  profileMenuItemAddress.addEventListener('click', event => {
    event.preventDefault();
    profileSectionsDetails.innerHTML = '';

    // Вызываю функцию для вызова API (функция getCurrentUser) чтобы заполнить детали меню "Мой адрес":
    renderAddress();
  });

  renderContacts();
};

renderProfile();
