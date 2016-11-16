'use strict';

var dom = {};

/**
* Returns card link and image.
* @param {object} threadObj Object containing metadata for a thread.
* @param {object} files Object containing upload file images.
*/

dom.addCardLink = function addCardLink(threadObj, files) {
  var cardLink = document.createElement('a');
  var cardImage = document.createElement('img');

  // Pull the first image direct from upload so we can display it quickly
  var fileReader = new FileReader();
  fileReader.onload = function () {
    cardImage.src = fileReader.result;
    cardImage.classList.add('card-img-top');
    cardImage.classList.add('img-fluid');
    cardLink.appendChild(cardImage);
  };
  fileReader.readAsDataURL(files[0]);

  // Set link and add to link to card
  cardLink.setAttribute('href', '/thread/' + threadObj.threadId);

  return cardLink;
};

/**
* Returns card text with 'Uploaded 0 mins ago'
*/
dom.addCardText = function addCardText() {
  var cardText = document.createElement('p');
  var cardTime= document.createElement('small');
  cardText.classList.add('card-text');
  cardTime.classList.add('text-muted');
  cardTime.innerHTML = 'Uploaded 0 mins ago';
  cardText.appendChild(cardTime);

  return cardText;
};

/**
* Returns card block.
* @param {object} threadObj Object containing metadata for a thread.
*/
dom.addCardBlock = function addCardBlock(threadObj) {
  var cardBlock = document.createElement('div');
  cardBlock.classList.add('card-block');
  var title = document.createElement('h4');
  title.classList.add('card-title');
  var titleLink = document.createElement('a');

  titleLink.classList.add('thumbnail-title');
  titleLink.innerHTML = threadObj.threadTitle;
  titleLink.setAttribute('href', '/thread/' + threadObj.threadId);
  title.appendChild(titleLink);
  cardBlock.appendChild(title);
  cardBlock.appendChild(dom.addCardText());

  return cardBlock;
};
