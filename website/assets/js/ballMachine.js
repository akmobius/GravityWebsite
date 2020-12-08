function ballMachine(parameters){

    this.parameters=parameters;
    this.balls=[];
    this.labels=[];

    this.draw = function(){
        for(var i=0;i<this.parameters.balls.length;i++){
            var ball=document.createElementNS("http://www.w3.org/2000/svg","g");
            ball.setAttribute("transform","translate("+this.parameters.balls[i].x+","+this.parameters.balls[i].y+")");
            //now we place circle inside the group
            var circle=document.createElementNS("http://www.w3.org/2000/svg","circle");
            circle.setAttribute("cx",0);
            circle.setAttribute("cy",0);
            circle.setAttribute("r",this.parameters.balls[i].r);
            circle.setAttribute("fill",this.parameters.balls[i].color);
            ball.appendChild(circle);
            //now we add the text to the group
            var label=document.createElementNS("http://www.w3.org/2000/svg","text");
            label.setAttribute("x",0);
            label.setAttribute("y",0);
            label.setAttribute("font-size",this.parameters.balls[i].r);
            label.setAttribute("fill","white");
            label.innerHTML=this.parameters.balls[i].mass;
            label.setAttribute("text-anchor","middle");
            label.setAttribute("alignment-baseline","middle");
            ball.appendChild(label);
            this.parameters.svg.appendChild(ball); //this appends the child to SVG element (otherwise this is not shown on screen)
            this.balls.push(ball); //we save the ball because we want to animate these balls
            this.labels.push(label); //keep track of labels
        }
    }

    this.setMass = function(i,m){     
        this.labels[i].innerHTML=m;
    }

    this.letFall = function(){
        let start;  //start time is initially undefined
        var step = function(timestamp){
            if (start === undefined) //set start time once after the first call
              start = timestamp;
            const t = (timestamp-start)/1000; //t is the elapsed time in seconds

            //console.log(t); //for debugging - show time in console
            //here is the physics
            var notYetStopped=false;
            for(var i=0;i<this.balls.length;i++){
                var xstart=this.parameters.balls[i].x;
                var ystart=this.parameters.balls[i].y;
                //now calculate the currentx, currenty positions at time t
                let currentx=xstart;
                let currenty=ystart+(9.8/2)*t*t;
                if (currenty>this.parameters.ground-this.parameters.balls[i].r){
                    currenty=this.parameters.ground-this.parameters.balls[i].r;
                }
                else{
                    notYetStopped=true;
                }
                //now we set cx, cy attributes of the balls
                this.balls[i].setAttribute("transform","translate("+currentx+","+currenty+")");
            }
            if (notYetStopped){
                window.requestAnimationFrame(step.bind(this));
            }
        }
        window.requestAnimationFrame(step.bind(this));
    }

    //draw the balls at initial positions of the SVG (with correct radius and color)
    this.draw();
}