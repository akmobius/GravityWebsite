# -*- coding: utf-8 -*-
"""
Created on Wed Nov 25 18:02:59 2020

@author: ariel
"""
from vpython import *
import math

def ballsFalling (params):
    #Define constants and initial conditions
    g=9.81
    h = 2
    pballs = []
    balls =[]
    for i in range(len(params)):
        pballs.append(params[i]["mass"]*vector(0,0,0))
        #Create ball object
        balls.append(sphere(pos=vector(params[i]["x"],h,0), radius = 0.2, color = params[i]["color"]))

    #Time step
    deltaT = 0.1
    t = 0

    while True:
        hitGround=0
        for i in range(len(params)):
            Fgrav = vector(0, -params[i]["mass"] *g, 0)
            pballs[i] = pballs[i] + Fgrav*deltaT
            newPos=balls[i].pos + (pballs[i]/params[i]["mass"])*deltaT
            if newPos.y>-2:
                balls[i].pos = newPos
            else:
                hitGround+=1
        if hitGround>=len(params):
            print("finished")
            break
        print(hitGround)
        t=t+deltaT
        sleep(1)

        
ballsFalling([{"mass":0.2,"x":0.2,"color": color.red},{"mass":1,"x":1,"color": color.blue}])
