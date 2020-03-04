$(document).ready( initializeApp );

function initializeApp() {
    var gameBoard = new Board();
    gameBoard.addPlayer('Warren');
    gameBoard.addPlayer('Elon');
    gameBoard.initializeBoard();
}
