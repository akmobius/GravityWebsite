# OrbitModel
#Modeling a Two-Body System in Space
"""
Code to model orbit of a two-body system. Can be used to teach Kepler's Laws.

"""

from vpython import *
import math

def body(position: "vector",rad: "metres",mass: "kg", texture= False, angle= 0.01,axis= vector(0,1,0)) -> "body":
    """ 
        This function returns a body which could be a planet, star or asteroid.
    
        position =  A vector which represents the position of the body in our
        coordinate system in metres, this normally can be arbitrarily
        chosen as long as magintude of radius coincide.
        
        radius = Radius of body in metres. Due to the limitations of showing
        the actual sizes between, e.g. the sun and the earth, and fitting
        them in a screen, after experimentation, it has been found that it is
        better to choose a radius of 1 smaller order of magnitude than the
        order of magnitudes in the position rather than the actual radius of 
        the two bodies.
        
        mass = Mass of boody in kilograms.
        
        texture = This is by default False as there are many bodies for which
        we can't obtain a texture but if there is one, then this is assigned
        as one of the attributes of the body.
        
        angle = In radians, by default it is 0.01 and is the angle that the
        the body is tilted respect to its axis.
        
        axis =  A vector which by default is (0,1,0) and represents the axis
        of rotation of the body.
        
        Using the class sphere(), this function adds new attributes to this
        this class such as mass,angle and axis and sets some default conditions 
        too such as make_trail, interval, etc.
    """
    
    body = sphere(pos= position, radius= rad, make_trail = True,trail_type='points', interval=10, retain=10)
    #The folowing lines will add new atributes to the sphere object which is 
    #body.
    body.mass = mass
    body.angle = angle
    body.axis = axis
    if texture != False:
        body.texture = texture
    return body

def binary_system(body1,body2):
    """"
        This function takes as inputs two bodies and shows their motion
        in space using Newton's Gravitational Laws and Momentum's Conservation.
        
        body1 and body2 are two bodies which were created using the previous
        body() function.
        
        Some other constants are also defined at the beginning such as G,
        the gravitational constant.
        
        Moreover a new attribute will be added to the bodies which is
        their momentum which is constantly changing in the while loop.
        
        The position and the respective distances between the two bodies are
        also constantly changing due to the infiinite while loop.
        The function will end up producing an scenario where both bodies are
        in a binary system orbiting around the center of mass of the system.
    """
    scene.forward = vector(0,-.3,-1)
    #This will be the intial viewpoint from which we will see the scene.
    
    G = 6.7e-11
    
    initial_velocity = vector(0,0,1e4)
    #We stil need to resolve some of the physics behind this velocity, but
    #initally for a system of masses 2e30 and 1e30, this was the intial
    #velocity of the bigger mass and we know the code worked with this conditions, 
    #so later in the code, using some ratios respect to the original
    #2e30 and 1e30 masses compared to the input ones and by multiplying them
    #to this velocity, we can create a new initial velocity which would
    #work for any masses we choose for the bodies.
    
    dt = 1e5
    #dt represents the difference in time that occurs for each impulse to be
    #added to the momentums of each body.
    
    #The following if/else statement sets big as the body with the bigger
    #mass and small as the body with the smaller mass.
    if body1.mass > body2.mass:
        big = body1
        small = body2
    else:
        big = body2
        small = body1
        
    #In here we will see how we use the following ratios to obtain the new
    #value of the initial velocity for the big body. This was obtained after
    #experimentation from an intial_velocity that we knew that worked for 2 
    #bodies. We will try to find a better way to do it with physics.
    ratio_small_mass = small.mass/1e30
    ration_big_masss = big.mass/2e30
    ratio_masses = ratio_small_mass/ration_big_masss
    initial_velocity = initial_velocity*ratio_masses
    big.momentum = big.mass*initial_velocity
    #Due that we assume we are in a closed system where momentum is conserved
    #and that it was zero originally in the z direction, we establish 
    #the momentum of the small body as the opposite of the big body's momentum.
    small.momentum = -big.momentum
    
    #Use of while loop to run the scenario.
    while True:
        #Rate determines how fast we want to see the system moving,
        #after some trials 50 seems adequate for this project.
        rate(50)
        r = small.pos - big.pos
        #Use of the Gravitational Force formula to calculate F in the r 
        #direction, hence use of r.hat in the equation.
        F = G * big.mass * small.mass * r.hat / mag(r)**2
        #Using Newton's 2nd Law, the momentum of the big body will increase due
        #to the impulse given by F*dt.
        big.momentum += F*dt
        #By consevatium of momentum, if one of them increases by F*dt,
        #the other one has to decrease by the same amount.
        small.momentum -= F*dt
        #the respective position of each also changes as they get new momentum
        #therefore we can change their position using dx = v*dt, in this case 
        #where the new v is given by dividing the new momentum by the mass
        #of the body and multiplying it by how long this occurs which is dt.
        big.pos += (big.momentum/big.mass)*dt
        small.pos += (small.momentum/small.mass)*dt
        #Finally using the rotate() function with original attributes of angle
        #and axis from each body, we can make the bodies rotate.
        big.rotate(angle = big.angle, axis = big.axis)
        small.rotate(angle = small.angle, axis = small.axis)
        
if __name__ == "__main__":
    pass
    #Example of earth-sun system right below
    #body1 = body(vector(0,0,0),2e10,2e30,"https://i.imgur.com/ejXbe1E.jpg")
    #body2 = body(vector(1.5e11,0,0),1e10,6e24,"https://i.imgur.com/dl1sA.jpg",angle = 0.4, axis= vector(1,1,math.cos(23.5)))
    #binary_system(body1,body2)

        
    
