export default class Card {
  constructor(
    { data, handleCardClick, handleDeleteClick, handleCardLike },
    cardSelector
  ) {
    this._title = data.name;
    this._url = data.link;
    this._likes = data.likes;
    this.cardSelector = cardSelector;
    this._handleCardClick = handleCardClick;
    this._handleDeleteClick = handleDeleteClick;
    this._handleCardLike = handleCardLike;

    this._id = data._id;
  }

  returnID() {
    console.log(this._id);
    return this._id;
  }

  returnLikes() {
    console.log(this._likes);
    return this._likes;
  }

  _getTemplate() {
    const cardElement = document
      .querySelector("#card__template")
      .content.querySelector(".card")
      .cloneNode(true);

    return cardElement;
  }

  showDeleteButton() {
    this._deleteBtn.classList.add("card_show-delete-btn");
  }

  hideDeleteButton() {
    this._deleteBtn.classList.add("card_show-hide-btn");
  }

  _handleLikeIcon() {
    this._cardCount.textContent = 90;
  }

  _setEventListeners() {
    this._cardCount.textContent = this.returnLikes().length;
    this._cardLikeBtn.addEventListener("click", () => {
      this._cardLikeBtn.classList.toggle("card__heart_active");
      this._handleCardLike(this.returnLikes);
    });
    this._deleteBtn.addEventListener("click", () => {
      this._element.remove();
      this._element = null;
      this._handleDeleteClick(this.returnID());
    });
    this._cardPic.addEventListener("click", () => this._handleCardClick());
  }

  _setElements() {
    this._cardPic.src = this._url;
    this._cardPic.setAttribute("alt", this._title);
    this._cardTitle.textContent = this._title;
  }

  generateCard() {
    this._element = this._getTemplate();
    this._cardPic = this._element.querySelector(".card__pic");
    this._cardTitle = this._element.querySelector(".card__title");
    this._deleteBtn = this._element.querySelector(".card__delete-btn");
    this._cardLikeBtn = this._element.querySelector(".card__heart");
    this._cardCount = this._element.querySelector(".card__likes_count");

    this._setEventListeners();
    this._setElements();

    return this._element;
  }
}
