class Frog {
    constructor(color, domElement) {
        this.color = color;
        this.row = null;
        this.col = null;
        this.domElement = $(domElement);
        this.handleClick = this.handleClick.bind(this);
        // $('.tile').on('click', '.frog', this.handleClick );
    }
    getColor(){
        return this.color;
    }
    setPosition(row, col){
        this.row = row;
        this.col = col;
        
    }
    getPosition(){
        return {row: this.row, col: this.col};
    }
    handleClick(){
        console.log(this)

    }
    setClickHandler(frog) {
        this.handleClick = this.handleClick.bind(this);
        $('.tile').on('click', frog, this.handleClick );
    }

    getFrog() {
        return $('<div>').addClass("frog " + this.color);
    }
}
