# OrbitModel
Modeling a Two-Body System in Space

This code was created in partnership with Franck Belemkoabga and Gyalpo Dongo-Aguirre for an MIT 8.012 Mini Project.
It shows the orbit of any two-body system following Kepler's laws (although our code starts from first principles- 
uses Newton's Laws and Conservation of Momentum) The visualization will be produced using the 
different features of vpython.
Before running the code, in the command prompt for python/anaconda type: 
pip install vpython
so that the code works and can use the vpython package.
The code as it is set up now models the Earth and Sun. Here are some model orbital elements to create a white dwarf/giant star system (very interesting to look at!).
Initial conditions for the white dwarf:
 body1 = body(vector(0,0,0),2e9,1e30)
 body1.color = color.white
 body2 = body(vector(5e10,0,0),1e9,6e25)
 body2.color = color.blue
 binary_system(body1,body2)
Here is the setup to model a binary star system:
 body1 = body(vector(-1e11,0,0),2e10,2e30)
 body1.color = color.white
 body2 = body(vector(1.5e11,0,0),1e10,1e30)
 body2.color = color.blue
 binary_system(body1,body2)
