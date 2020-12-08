//this is a library for animating the motion of two bodies in space
//parameters is an object with the following properties
// svg: svg root object to which we will add the planet
// planets: [{r: 15, mass: 1, color: rgb(255,0,0)},{r: 20, mass: 2, color: rgb(0,255,0)}],



function planetMachine(parameters){

    this.parameters=parameters;
    this.planets=[];
    this.labels=[];

    //precalculate width and heigt og svg elements
    var svgWidth=parseInt(this.parameters.svg.getAttribute("width"));
    var svgHeight=parseInt(this.parameters.svg.getAttribute("height"));

    this.draw = function(){
        for(var i=0;i<this.parameters.planets.length;i++){
            var planet=document.createElementNS("http://www.w3.org/2000/svg","g");
            planet.setAttribute("transform","translate(0,0)");
            //now we place circle inside the group
            var circle=document.createElementNS("http://www.w3.org/2000/svg","circle");
            circle.setAttribute("cx",0);
            circle.setAttribute("cy",0);
            circle.setAttribute("r",this.parameters.planets[i].r);
            circle.setAttribute("fill",this.parameters.planets[i].color);
            planet.appendChild(circle);
            //now we add the text to the group
            var label=document.createElementNS("http://www.w3.org/2000/svg","text");
            label.setAttribute("x",0);
            label.setAttribute("y",0);
            label.setAttribute("font-size",this.parameters.planets[i].r*0.5);
            label.setAttribute("fill","white");
            if (i==0){
                label.innerHTML="6*10^"+this.parameters.planets[i].mass;
            }
            else{
                label.innerHTML="2*10^"+this.parameters.planets[i].mass;
            }
            label.setAttribute("text-anchor","middle");
            label.setAttribute("alignment-baseline","middle");
            planet.appendChild(label);
            this.parameters.svg.appendChild(planet); //this appends the child to SVG element (otherwise this is not shown on screen)
            this.planets.push(planet); //we save the planet because we want to animate these planets
            this.labels.push(label); //keep track of labels
        }
    }

    this.setMass = function(i,exponent){   
        this.parameters.planets[i].mass=exponent;
        if (i==0){
            this.labels[i].innerHTML="6*10^"+this.parameters.planets[i].mass;
        }
        else{
            this.labels[i].innerHTML="2*10^"+this.parameters.planets[i].mass;
        }
        this.initAnimation=true; //signals to the animation to reset the initial velocity
    }

    //make some vector operation functions
    this.scalarVectorMultiplication=function(scalar,vector){
        var vcopy=vector.slice();
        for(var i=0;i<vcopy.length;i++){
            vcopy[i]=scalar*vcopy[i];
        }
        return vcopy;
    }

    this.vectorDotMultiplication=function(vector1,vector2){
        let dotProduct=0;
        for(var i=0;i<vector1.length;i++){
            dotProduct+=vector1[i]*vector2[i];
        }
        return dotProduct;
    }


    this.initAnimation=true;
    this.drawing=false;
    this.move = function(){
        if (this.drawing){
            this.initAnimation=true;
            return;
        }
        this.drawing=true;
        this.draw();
        let start;  //start time is initially undefined
        let previousTimestamp;

        //determine the larger/smaller body
        if (this.parameters.planets[0].mass >this.parameters.planets[1].mass)
        {
            var bigIndex=0;
            var smallIndex=1;
        }
        else
        {
            var bigIndex=1;
            var smallIndex = 0;
        }
                
        //set initial values for position of sun and earth as well as respective momentum
        var sunEarthDistance=1.5*(10**11);
        var xsmall = sunEarthDistance;
        var ysmall = 0
        var zsmall = 0
        var xbig = 0
        var ybig = 0
        var zbig = 0
        
        var G=6.67*(10**(-11)); //gravitational constant
        
        //calculate orbital velocity of system (has to be less than the escape velocity)
        if (this.parameters.planets[smallIndex].mass ==29 && this.parameters.planets[bigIndex].mass==30) 
        {
            var velocity = 10**4; //velocity calc different for binary star system
        }
        else
        {        
            var velocity = Math.sqrt(2*G*(6*(10**this.parameters.planets[smallIndex].mass)+2*(10**this.parameters.planets[bigIndex].mass))/(sunEarthDistance*2))
        }
           
        var initial_velocity=[0,velocity,0]; 
        var small_momentum = this.scalarVectorMultiplication(6*(10**this.parameters.planets[smallIndex].mass),initial_velocity);
        var big_momentum = this.scalarVectorMultiplication(-1, small_momentum);
        
        var step = function(timestamp){
            if (this.initAnimation){
                this.initAnimation=false;
                xsmall = sunEarthDistance;
                ysmall = 0
                zsmall = 0
                xbig = 0
                ybig = 0
                zbig = 0        
                //recalculate initial velocity and momentum
                //calculate orbital velocity of system (has to be less than the escape velocity)
                if (this.parameters.planets[smallIndex].mass ==29 && this.parameters.planets[bigIndex].mass==30) 
                {
                    velocity = 10**4; //velocity calc different for binary star system
                }
                else
                {        
                    velocity = Math.sqrt(2*G*(6*(10**this.parameters.planets[smallIndex].mass)+2*(10**this.parameters.planets[bigIndex].mass))/(sunEarthDistance*2))
                }
           
                initial_velocity=[0,velocity,0]; 
                small_momentum = this.scalarVectorMultiplication(6*(10**this.parameters.planets[smallIndex].mass),initial_velocity);
                big_momentum = this.scalarVectorMultiplication(-1, small_momentum);
            }

            if (start === undefined){
                //set start time once after the first call
                start = timestamp;
            }
            if (previousTimestamp==undefined){
                previousTimestamp=timestamp;
            }
            var realTime = (timestamp-start)/1000; //t is the elapsed time in seconds
            //we scale it so that 10 seconds is equal to 1 year=365*24*3600
            var dayOfYear=realTime*365*24*360;
            //now we calculate the change in time between two animations and scale everything to a 10s = 1 year
            var deltaT=(timestamp-previousTimestamp)/1000*365*24*360;     
            previousTimestamp=timestamp;

            //console.log(t); //for debugging - show time in console
            //here is the physics

            var xDirection = xsmall-xbig;
            var yDirection = ysmall-ybig;
            var zDirection = zsmall-zbig;

            // now find gravitational force between two bodies
            var distanceSquared=xDirection**2+yDirection**2+zDirection**2;
            var gravityScalar=G*2*(10**this.parameters.planets[bigIndex].mass) *6*(10**this.parameters.planets[smallIndex].mass)/distanceSquared;
            //gravity has a direction: this is the direction of the xpos/ypos/zpos vector
            //we normalize that vector to make it a unit vector
            var xDirectionNormalized=xDirection/Math.sqrt(distanceSquared);
            var yDirectionNormalized=yDirection/Math.sqrt(distanceSquared);
            var zDirectionNormalized=zDirection/Math.sqrt(distanceSquared);
            //unit vector describes the direction of the small planet towards the large planet
            var xforce = xDirectionNormalized*gravityScalar;
            var yforce = yDirectionNormalized*gravityScalar;
            var zforce = zDirectionNormalized*gravityScalar;

            //now relate this to the momentum
            big_momentum[0] += xforce*deltaT;
            big_momentum[1] += yforce*deltaT;
            big_momentum[2] += zforce*deltaT;

            small_momentum[0] -= xforce*deltaT;
            small_momentum[1] -= yforce*deltaT;
            small_momentum[2] -= zforce*deltaT;

            //now calculate the planets' x/y positions at time t
            xbig += (big_momentum[0]/(2*(10**this.parameters.planets[bigIndex].mass)))*deltaT;
            ybig += (big_momentum[1]/(2*(10**this.parameters.planets[bigIndex].mass)))*deltaT;
            zbig += (big_momentum[2]/(2*(10**this.parameters.planets[bigIndex].mass)))*deltaT;
            xsmall += (small_momentum[0]/(6*(10**this.parameters.planets[smallIndex].mass)))*deltaT;
            ysmall += (small_momentum[1]/(6*(10**this.parameters.planets[smallIndex].mass)))*deltaT;
            zsmall += (small_momentum[2]/(6*(10**this.parameters.planets[smallIndex].mass)))*deltaT;

            //scale everything into a box of size 2*sunEarthDistance
            var xBigScaled=xbig/sunEarthDistance/3;
            var yBigScaled=ybig/sunEarthDistance/3;
            var xSmallScaled=xsmall/sunEarthDistance/3;
            var ySmallScaled=ysmall/sunEarthDistance/3;
            var minSvgDim=svgHeight;  //set minSvgDim to the smaller of svhWidth and svgHeight
            if (svgWidth<minSvgDim){
                minSvgDim=svgWidth;
            }
            var xBigScreen=svgWidth/2+minSvgDim*xBigScaled;
            var yBigScreen=svgHeight/2+minSvgDim*yBigScaled;
            var xSmallScreen=svgWidth/2+minSvgDim*xSmallScaled;
            var ySmallScreen=svgHeight/2+minSvgDim*ySmallScaled;


            //now we set cx, cy attributes of the planets
            this.planets[bigIndex].setAttribute("transform","translate("+xBigScreen+","+yBigScreen+")");
            this.planets[smallIndex].setAttribute("transform","translate("+xSmallScreen+","+ySmallScreen+")");
        
            window.requestAnimationFrame(step.bind(this));
        }
        window.requestAnimationFrame(step.bind(this));
    }

    //draw the planets at initial positions of the SVG (with correct radius and color)
    //this.draw();
};