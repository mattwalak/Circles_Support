function CircleButton(posX, posY, diameter, id, onClickCallback){
    this.posX = posX;
    this.posY = posY;
    this.diameter = diameter;
    this.id = id;
    this.onClickCallback = onClickCallback;
    this.isPressedIn = false;


    this.draw = function(){
        if(this.isPressedIn){
            fill(255, 0, 0);
        }else{
            fill(255);
        }
        
        circle(posX, posY, diameter);
    }

    this.checkClick = function(){
        var dist = Math.sqrt(Math.pow(mouseX - this.posX, 2) + Math.pow(mouseY - this.posY, 2));
        if (dist < (this.diameter / 2)){
            this.isPressedIn = !this.isPressedIn;
            onClickCallback(this.id, (this.isPressedIn ? 1 : -1));
        }
    }

    this.otherCircleSelected = function(otherId){
        if(id != otherId){
            this.isPressedIn = false;
        }
    }

}