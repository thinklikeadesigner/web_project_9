import css from "./index.css";
import Card from "./components/Card.js";
import Section from "./components/Section.js";
import {
  cardsConfig,
  popupConfig,
  profileConfig,
  profileJob,
  profileName,
  settings,
} from "./utils/constants.js";

import PopupWithImage from "./components/PopupWithImage.js";
import PopupWithForm from "./components/PopupWithForm.js";
import Popup from "./components/Popup.js";
import { UserInfo } from "./components/UserInfo.js";
import FormValidator from "./components/FormValidator.js";
import Api from "./components/Api.js";
import { name } from "file-loader";



const api = new Api({
  baseUrl: "https://around.nomoreparties.co/v1/group-5",
  headers: {
    authorization: "b0d2099d-1e3e-49c8-a58b-52391c0a6488",
    "Content-Type": "application/json",
  },
});


const deleteCardModal = new PopupWithForm(
  {
    popupSelector: ".modal_type_delete"});






function random() {
  console.log('deleted');
}








function changeAvatar({ avatar }) {
  document.querySelector(".avatar-submit").textContent = "Saving...";
  api.setUserAvatar({ avatar }).then((res) => {
    document.querySelector(".avatar-submit").textContent = "Save";
    document.querySelector(".profile__pic").src = res.avatar;
    api.getUserInfo().then(function (res) {
      userInfo.setUserInfo({
        userName: res.name,
        userDescription: res.about,
        userAvatar: res.avatar,
      });
    });
  });
}

api
  .getAppInfo()
  .then(([userData, cardListData]) => {
    const cardsList = new Section(
      {
        array: cardListData,
        renderer: (data) => {
          const card = new Card(
            {
              data,
              handleCardClick: () => {
                picModal.open(data);
              },
              handleDeleteClick : (cardID) => {
                deleteCardModal.open(cardID);
                deleteCardModal.submitData((cardID) => {
                    api.removeCard(cardID)
                      .then(() => {
                        card.deleteCard();
                        deleteCardModal.close();
                      })
                      .catch(err => console.log(err));
            
              });},
              handleCardLike: (cardID) => {
                {
                  if (card.heart.classList.contains("card__heart_active")) {
                    card.heart.classList.remove("card__heart_active");

                    api
                      .deleteCardModalLike(cardID)
                      .then((res) => {
                        card.displayLikeCount(res.likes.length);
                      })
                      .catch((error) => console.log(error.type));
                  } else {
                    card.heart.classList.add("card__heart_active");
                    api
                      .addCardLike(cardID)
                      .then((res) => {
                        card.displayLikeCount(res.likes.length);
                      })
                      .catch((error) => console.log(error.type));
                  }
                }
              },
            },
            userData._id,
            cardsConfig.cardSelector
          );
          card.displayLikeCount(card._data.likes.length);
          cardsList.setItem(card.generateCard());
          api.getUserInfo().then((res) => {
            if (res._id === data.owner._id) {
              card.showDeleteButton();

              userInfo.setUserInfo({
                userName: res.name,
                userDescription: res.about,
                userAvatar: res.avatar,
              });
            } else {
              card.hideDeleteButton();
            }
          });
        },
      },
      cardsConfig.placesWrap
    );
    cardsList.renderItems();
    const addModal = new PopupWithForm({
      popupSelector: popupConfig.addFormModalWindow,
      handleFormSubmit: (data) => {
        console.log(userData._id);
        document.querySelector(".places-submit").textContent = "Saving...";
        api
          .addCard(data)
          .then((res) => {
            document.querySelector(".places-submit").textContent = "Save";
            const card = new Card(
              {
                data: res,
                handleCardClick: () => {
                  picModal.open(data);
                },
                // handleDeleteClick: (cardID) => {
                //   deleteCardModal.open(cardID);
                //   // api.removeCard(cardID);
                // },
                handleCardLike: (cardID) => {
                  {
                    {
                      if (card.heart.classList.contains("card__heart_active")) {
                        card.heart.classList.remove("card__heart_active");
                        api
                          .deleteCardModalLike(cardID)
                          .then((res) => {
                            card.displayLikeCount(res.likes.length);
                          })
                          .catch((error) => console.log(error.type));
                      } else {
                        card.heart.classList.add("card__heart_active");
                        api
                          .addCardLike(cardID)
                          .then((res) => {
                            card.displayLikeCount(res.likes.length);
                          })
                          .catch((error) => console.log(error.type));
                      }
                    }
                  }
                },
              },
              userData._id,
              cardsConfig.cardSelector
            );
            cardsList.setItem(card.generateCard());

            card.showDeleteButton();
          })
          .catch((err) => console.log(err));
      },
    });
    addModal.setEventListeners();
    document
      .querySelector(".profile__add-btn")
      .addEventListener("click", function () {
        addModal.open();
      });
  })
  .catch((err) => console.log(err));

const userInfo = new UserInfo({
  userNameSelector: profileConfig.profileTitle,
  userDescriptionSelector: profileConfig.profileDescription,
  userAvatarSelector: profileConfig.profileAvatar,
});
api
  .getUserInfo()
  .then((res) => {
    userInfo.setUserInfo({
      userName: res.name,
      userDescription: res.about,
      userID: res._id,
      userAvatar: res.avatar,
    });
  })
  .catch((err) => console.log(err));

const editModal = new PopupWithForm({
  popupSelector: popupConfig.editFormModalWindow,
  handleFormSubmit: ({ name, about }) => {
    document.querySelector(".edit-submit").textContent = "Saving...";

    api.getUserInfo({ name, about }).then((res) => {
      document.querySelector(".edit-submit").textContent = "Save";
      profileJob.textContent = res.about;
      profileName.textContent = res.name;
    });

    api.setUserInfo({ name, about }).then((res) => {
      userInfo.setUserInfo({
        userName: res.name,
        userDescription: res.about,
        userAvatar: res.avatar,
      });
    });
  },
});

const avatarModal = new PopupWithForm({
  popupSelector: popupConfig.avatarFormModalWindow,
  handleFormSubmit: changeAvatar,
});


const picModal = new PopupWithImage(".modal_type_pic");



{/* <div class="modal modal_open modal_type_delete">
<div class="modal__container">
  <form class ="form form_delete"
  >
    <h2 class="form__title">Are you sure?</h2>
    <button type="submit" class="form__button delete-submit">Yes</button>
  </form>
  <button
    type="reset"
    aria-label="Close Button"
    class="modal__close-button modal__close-button_add"
  ></button>
</div>
</div> */}


const avatarModalButton = document.querySelector(".profile__pic");
const editModalButton = document.querySelector(".profile__edit-btn");



editModalButton.addEventListener("click", () => editModal.open());
avatarModalButton.addEventListener("click", () => avatarModal.open());

avatarModal.setEventListeners();
editModal.setEventListeners();
picModal.setEventListeners();
deleteCardModal.setEventListeners();


const validateAdd = new FormValidator(settings, ".form_add");
const validateEdit = new FormValidator(settings, ".form_edit");
const validateAvatar = new FormValidator(settings, ".modal_type_avatar");

validateEdit.enableValidation();
validateAdd.enableValidation();
validateAvatar.enableValidation();




