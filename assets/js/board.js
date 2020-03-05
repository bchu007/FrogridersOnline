class Board {
    constructor() {
        this.board = [];
        this.rows = 9;
        this.columns = 9;
        this.removedFrogs = { "red": null, "blue": null, "yellow": null, "brown": null };
        this.playerArray = [];
        this.currentPlayer = 0;
        this.possibleActions = [];
        this.firstSelectedFrog = null;
        this.resetGame = this.resetGame.bind(this); // ?
        this.modal = new Modal('#win-modalShadow', "#win-modalBody", "#win-modalMessage", "#win-modalButton");
        this.help = new Modal('#help-modalShadow', "#help-modalBody", "#help-modalMessage", "#help-modalButton");
        this.helpOn = false;
        this.plunk = false;
    }

    initializeBoard() {
        //clear old board

        $('.gameBoard').empty()
        $('#player1').empty();
        $('#player2').empty();
        $('#player1').html('0');
        $('#player2').html('0');
        $('.player1').css("border", "none");
        $('.player2').css("border", "none");
        $('.player1').css("border", "blue medium solid");
        this.modal.init();
        this.help.init();
        //populates board by creating a 2d array representind the board on the DOM
        for (var col = 0; col < this.columns; col++) {
            this.board.push(new Array(this.row))
        }

        var colors = ['red', 'blue', 'yellow', 'brown'];
        for (var row = 0; row < this.rows; row++) {
            for (var col = 0; col < this.columns; col++) {
                var indexes = { 'data-row': row, 'data-col': col };
                var tile = $('<div>').addClass('tile').attr(indexes);
                var leaf = $('<div>').addClass('leaf');
                if (row === 4 && col === 4) {
                    leaf.addClass('center');
                    tile.append(leaf);
                    this.board[row][col] = null;
                } else {
                    var colorIndex = Math.floor(Math.random() * 4);
                    var frog = $('<div>').addClass('frog').addClass(colors[colorIndex]);

                    tile.append(leaf);
                    tile.append(frog);

                    var newFrog = new Frog(colors[colorIndex], tile)
                    newFrog.setPosition(row, col);
                    this.board[row][col] = newFrog;

                }
                $('.gameBoard').append(tile);

            }
        }
        this.handleCellClick = this.handleCellClick.bind(this);
        $('.tile').on('click', '.leaf', this.handleCellClick);
        $('.tile').on('click', '.frog', this.handleCellClick);
        $('.tile').on('click', '.leaf', this.handleCellClick);


        $('.fa-info-circle').on('click', this.help.show)
    }


    addPlayer(player) {
        this.playerArray.push(new Player(player));
        //adds player to the beginning of game
        //change the names of the players
        //returns nothing

    }

    alternatePlayer() {
        //gets the next player and sets it as current player
        //returns nothing
        if (this.currentPlayer < this.playerArray.length - 1) {
            this.currentPlayer++;
            $('.player1').css("border", "none");
            $('.player2').css("border", "red medium solid");
            $('.frog').removeClass('rotateBack')
            $('.frog').addClass('rotate')
        }
        else {
            this.currentPlayer = 0;

            $('.player2').css("border", "none");
            $('.player1').css("border", "blue medium solid");
            $('.frog').removeClass('rotate')
            $('.frog').addClass('rotateBack')
        }

    }

    handleCellClick() {
        // this.thud();
        this.plunk = false;
        var tile = event.currentTarget
        var col = parseInt($(tile).attr('data-col'));
        var row = parseInt($(tile).attr('data-row'));

        if (this.possibleActions.length === 0) {
            var clickedFrog = this.board[row][col];

            this.firstSelectedFrog = clickedFrog;
            if (this.board[row][col]) {
                //check valid moves
                this.findValidMoves(clickedFrog);
                //color valid tiles
                this.colorTiles();
            }
            else {
                this.lily();
            }

        }
        else {
            //click on one of the possible actions
            //if tile is one of the possible actions remove frog in between
            for (var i = 0; i < this.possibleActions.length; i++) {
                var action_row = this.possibleActions[i]['target'][0];
                var action_col = this.possibleActions[i]['target'][1];
                if (action_row === row && action_col === col) {

                    this.splash()
                    this.plunk = true;
                    var target_row = this.possibleActions[i]['middle'][0];
                    var target_col = this.possibleActions[i]['middle'][1];

                    //give frog to player, or the points of the frog
                    var removedFrog = this.popFrog(this.board[target_row][target_col]);
                    this.possibleActions = [];
                    this.playerArray[this.currentPlayer].setFrogBag(removedFrog.getColor());

                    //move frog

                    var frogThatJumped = this.popFrog(this.firstSelectedFrog);
                    this.setFrog(frogThatJumped, action_row, action_col)

                    if (this.board[action_row][action_col] && this.findValidMoves(this.board[action_row][action_col])) {
                        this.clearTiles();
                        this.colorTiles();
                        $('#player' + (this.currentPlayer + 1)).text(this.playerArray[this.currentPlayer].calculateScore());
                    }
                    else {
                        this.clearTiles();
                        //clear coloring
                        //change player

                        $('#player' + (this.currentPlayer + 1)).text(this.playerArray[this.currentPlayer].calculateScore());
                        this.alternatePlayer();

                    }
                }

            }
        }

        if (this.winCondition()) {
            //endgame, modal

            var winnerMessage = "";
            if (parseInt($('#player1').text()) > parseInt($('#player2').text())) {
                winnerMessage = `Player 1 Wins<br/><br/><br/>
                    Score: ` + $('#player1').text();
            }
            else {
                winnerMessage = `Player 2 Wins<br/><br/><br/>
                Score: ` + $('#player2').text();
            }
            this.modal.updateMessage(winnerMessage);
            this.modal.show();
        }
    }

    thud() {
        var a = new Audio('http://www.soundjay.com/kitchen/sounds/freezer-close-1.mp3');
        a.play();
    }

    croak() {
        // var b = new Audio('http://www.californiaherps.com/sounds/psierratldn408solo.mp3');
        var a = new Audio('http://mrclan.com/fastdl/tfc/sound/fr-ribbit.wav');

        a.play();
    }

    validMove() { //high pitched water splash
        var a = new Audio('http://www.davidwills.us/cmis102a/Raptor2/drip.wav');
        a.play();
    }




    splash() {
        this.croak();
        var a = new Audio('http://4umi.com/web/sound/splash.wav');
        a.play();
    }

    lily() {
        var a = new Audio('http://chemrat.com/ChemHog2/programs_files/Nuclephiles/c_bang1.wav');
        a.play();
    }
    findValidMoves(frog) {
        this.possibleActions = [];
        var currentPosition = frog.getPosition(); // {x: this.x, y: this.y}; {x: 1, y: 1}

        var up = this.checkInDirection(currentPosition.row, currentPosition.col, "up"); // {row: 1, col:2}
        var down = this.checkInDirection(currentPosition.row, currentPosition.col, "down"); // {row:1, col:0}
        var left = this.checkInDirection(currentPosition.row, currentPosition.col, "left"); // {row:-1, col:0}
        var right = this.checkInDirection(currentPosition.row, currentPosition.col, "right");

        var directions = [this.clone(up), this.clone(down), this.clone(left), this.clone(right)];
        var nextDirection = [this.clone(up), this.clone(down), this.clone(left), this.clone(right)];
        var stringDir = ["up", "down", "left", "right"];
        for (var i = 0; i < directions.length; i++) {
            if (this.isInbound(directions[i].row, directions[i].col) && this.isFrog(this.board[directions[i].row][directions[i].col])) {
                nextDirection[i] = this.checkInDirection(directions[i].row, directions[i].col, stringDir[i]);
                if (this.isInbound(nextDirection[i].row, nextDirection[i].col) && this.board[nextDirection[i].row][nextDirection[i].col] === null) {
                    this.possibleActions.push({ "target": [nextDirection[i].row, nextDirection[i].col], "middle": [directions[i].row, directions[i].col] });
                }
            }
        }

        if (this.possibleActions.length === 0) {
            if(!this.plunk) {
                this.croak();
            }

            return false;

        }
        else {
            this.validMove();
            this.markFrog(frog);

            return true;

        }

        // if relative direction.x < 0 || relativeDirection.x > 9 || relativeDirection.y < 0 || relativeDirection.y > 9 { relativeDirection = false;}
        // if relativeDirection is undefined (empty tile) => false
        // if relativeDirection of frog at relativePosition is another frog => false
    }
    checkInDirection(row, col, direction) {
        //used by find valid moves for the current player
        const up = { row: 0, col: -1 };
        const down = { row: 0, col: 1 };
        const left = { row: -1, col: 0 };
        const right = { row: 1, col: 0 };

        if (direction === 'up') {
            return { row: row + up.row, col: col + up.col };
        }
        else if (direction === 'down') {
            return { row: row + down.row, col: col + down.col };
        }
        else if (direction === 'left') {
            return { row: row + left.row, col: col + left.col };
        }
        else if (direction === 'right') {
            return { row: row + right.row, col: col + right.col };
        }

    }



    isInbound(row, col) {
        return (row < this.rows && row >= 0 && col >= 0 && col < this.columns)
    }

    isFrog(frog) {
        if (frog && frog.constructor === Frog) {
            return true;
        }
        else {
            return false;
        }
    }

    popFrog(frog) {
        var index = frog.getPosition();
        var frogRemoved = this.board[index.row][index.col];
        this.board[index.row][index.col] = null;
        var x = $('[data-row=' + index.row + '][data-col=' + index.col + '] div.frog')
        x.remove();
        return frogRemoved;
    }

    markFrog(frog) {
        var index = frog.getPosition();
        var x = $('[data-row=' + index.row + '][data-col=' + index.col + '] div.frog')
        x.addClass('shadowed');
    }

    setFrog(frog, row, col) {

        var element = frog.getFrog();
        var selector = $('div.tile[data-row=' + row + '][data-col=' + col + ']');
        frog.setPosition(row, col);
        this.board[row][col] = frog;
        selector.append(element);
    }

    colorTiles() {
        for (var i = 0; i < this.possibleActions.length; i++) {
            var coordinates = this.possibleActions[i]['target'];
            var selector = $('div.tile[data-row=' + coordinates[0] + '][data-col=' + coordinates[1] + '] div.leaf');
            selector.addClass('choice');
        }
    }

    clearTiles() {
        $('div.leaf').removeClass('choice');
    }

    clone(src) {
        return Object.assign({}, src);
    }

    isValidEndMove(frog) {

        var currentPosition = frog.getPosition(); // {x: this.x, y: this.y}; {x: 1, y: 1}

        var up = this.checkInDirection(currentPosition.row, currentPosition.col, "up"); // {row: 1, col:2}
        var down = this.checkInDirection(currentPosition.row, currentPosition.col, "down"); // {row:1, col:0}
        var left = this.checkInDirection(currentPosition.row, currentPosition.col, "left"); // {row:-1, col:0}
        var right = this.checkInDirection(currentPosition.row, currentPosition.col, "right");

        var directions = [this.clone(up), this.clone(down), this.clone(left), this.clone(right)];
        var nextDirection = [this.clone(up), this.clone(down), this.clone(left), this.clone(right)];
        var stringDir = ["up", "down", "left", "right"];
        for (var i = 0; i < directions.length; i++) {
            if (this.isInbound(directions[i].row, directions[i].col) && this.isFrog(this.board[directions[i].row][directions[i].col])) {
                nextDirection[i] = this.checkInDirection(directions[i].row, directions[i].col, stringDir[i]);
                if (this.isInbound(nextDirection[i].row, nextDirection[i].col) && this.board[nextDirection[i].row][nextDirection[i].col] === null) {
                    return true;
                }
            }
        }
        return false;
    }

    winCondition() {
        var allFalse = true;
        var maxScoreReached = false;
        // if (this.playerArray[0].calculateScore() > 40 || this.playerArray[1].calculateScore() > 40){
        //     maxScoreReached = true;
        // }
        for (var row = 0; row < this.rows; row++) {
            for (var col = 0; col < this.columns; col++) {
                var frog = this.board[row][col];
                if (this.isFrog(frog)) {
                    if (this.isValidEndMove(frog)) {
                        allFalse = false;
                    }

                }
            }
        }
        if (maxScoreReached || allFalse) {
            return true;
        } else {

            return false;
        }

    }
    resetGame() {

        // reset all game properties / variables
        // call initialize board


        // this.board = [];
        // this.rows = 9;
        // this.columns = 9;
        // this.removedFrogs = {"red": null, "blue": null, "yellow": null, "brown": null};
        // this.playerArray = [];
        // this.currentPlayer = 0;
        // this.possibleActions = [];
        // this.firstSelectedFrog = null;
        // this.modal = new Modal('#modalShadow', "#modalBody", "#modalMessage", "#modalButton" );
        // this.initializeBoard();
    }
}
