class Modal {
    constructor(modalShadow, modalBody, modalMessage, modalButton){
        this.modalShadow = $(modalShadow);
        this.modalBody = $(modalBody);
        this.modalMessage = $(modalMessage);
        this.modalButton = $(modalButton);
        // this.onClose = null;
        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);
        
    }
    show(){
        this.modalShadow.show();
        this.modalBody.show();
        this.modalButton.show();
        console.log("show()");
    }
    hide(){
        this.modalShadow.hide();
        this.modalBody.hide();
        this.modalButton.hide();
        console.log(this.modalMessage, "hide");
    }
    updateMessage(modalTxt){
        this.modalMessage.text(modalTxt);
    }
    init(){
        this.hide();
        this.modalButton.off('click');
        this.modalButton.on('click', initializeApp);
        this.modalButton.on('click', this.hide);
    }

    
    
}