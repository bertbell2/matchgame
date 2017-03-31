var MatchGame = {};

/*
  Sets up a new game after HTML document has loaded.
  Renders a 4x4 board of cards.
*/

$(document).ready(function(){
  var $game = $(".game");
  var cards = MatchGame.generateCardValues() ;
  MatchGame.renderCards(cards, $game);
  $('.restart .btn').click(function(){
    $(this).prop("disabled", true);
    var $game = $(".game");
    var cards = MatchGame.generateCardValues() ;
    MatchGame.renderCards(cards, $game);
  });
});

/*
  Generates and returns an array of matching card values.
 */

MatchGame.generateCardValues = function () {
  var cards = [];
  for (var i = 1; i <= 8; i++) {
    cards.push(i);
    cards.push(i);
  }
  var randCards = [] ;
  while (cards.length != 0) {
    // Get a random integer between 0 and the length of the cards array
    var randIndex = Math.floor(Math.random() * cards.length);
    randCards.push(cards[randIndex]);
    cards.splice(randIndex, 1);
  }
  return randCards;
};

/*
  Converts card values to jQuery card objects and adds them to the supplied game
  object.
*/

MatchGame.renderCards = function(cardValues, $game) {
  var cardColors = ["hsl(25,85%,65%)",
                "hsl(55,85%,65%)",
                "hsl(90,85%,65%)",
                "hsl(160,85%,65%)",
                "hsl(220,85%,65%)",
                "hsl(265,85%,65%)",
                "hsl(310,85%,65%)",
                "hsl(360,85%,65%)"] ;
  $game.empty();
  $game.data("moves", 0);
  $('.score').text('Moves: 0');
  $game.data("flippedCards", []);
  for ( var i = 0; i < cardValues.length; i++) {
    var $card = $('<div class="col-xs-3 card"></div>');
    $card.data("value", cardValues[i]);
    $card.data("flipped", false);
    var colorIndex = cardValues[i] - 1;
    $card.data("color", cardColors[colorIndex]);
    $game.append($card);
  }
  $('.card').click(function(){
    MatchGame.flipCard($(this), $(".game"));
  });
};

/*
  Check if all cards are flipped
*/

MatchGame.gameOver = function($game) {
  var allFlipped = true ;
  $game.find('.card').each(function(){
    flipped = $(this).data("flipped");
    allFlipped = allFlipped && flipped ;
    if (!allFlipped) {
      return false ;
    }
  });
  return allFlipped ;
} ;

/*
  Flips over a given card and checks to see if two cards are flipped over.
  Updates styles on flipped cards depending whether they are a match or not.
 */

MatchGame.flipCard = function($card, $game) {
  var flipped = $card.data("flipped");
  if (flipped) {
    return;
  }
  $card.data("flipped", true) ;
  var value = $card.data("value") ;
  $card.text(value) ;
  var color = $card.data("color") ;
  $card.css("background-color", color);
  var flipped = $game.data('flippedCards');
  flipped.push($card);
  if (flipped.length === 2) {
    // We are making a move
    var moves = $game.data("moves");
    moves += 1 ;
    $game.data("moves", moves);
    $('.score').text('Moves: ' + moves);

    console.log("Completed " + moves + "moves.");
    // Do we have a match
    if (flipped[0].data("value") === flipped[1].data("value")) {
      var matchcss = {
        color: 'rgb(204,204,204)',
        backgroundColor: 'rgb(153,153,153)'
      };
      flipped[0].css(matchcss);
      flipped[1].css(matchcss);
      if (MatchGame.gameOver($game)) {
        console.log('Game Finished!');
        $('.restart .btn').prop("disabled", false);
      }
    } else {
      var card1 = flipped[0] ;
      var card2 = flipped[1] ;
      window.setTimeout(function() {
        card1.data("flipped",false)
          .text("")
          .css('background-color', 'rgb(32, 64, 86)');
        card2.data("flipped",false)
          .text("")
          .css('background-color', 'rgb(32, 64, 86)');
        }, 500) ;
    }
    $game.data('flippedCards', []);
  }
};
