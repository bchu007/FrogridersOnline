//13 brown, 7 red, 9 blue, 5 yellow

function createFrogs() {
  var imageArray = ['yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'brown', 'brown', 'brown', 'brown', 'brown', 'brown', 'brown', 'brown', 'brown', 'brown', 'brown', 'brown', 'brown'];
  for (var images = 0; images < 34; images++) {
    imageIndex = Math.floor(Math.random() * imageArray.length)
    var image = imageArray[imageIndex];
    imageArray.splice(imageIndex, 1)
    var card = $('<div>', { 'class': 'card' });
    var front = $('<div>', { 'class': image });
    var back = $('<div>', { 'class': 'lfz' });
    card.append(front);
    card.append(back);
    $("#container").append(card);
  }

}

/*
set game board size 90% vmin
element box size = 10% vmin
frog class: yellow, red, blue, brown

*/
