#include "fractal.h"

const enum Fractal fractalMap[NUM_FRACTALS] = { mandelbrot, newton, reciprocal, multibrot };
enum Fractal cfractal = multibrot; //reciprocal; //mandelbrot; //newton;

void pickFractal() 
{
	for (int i = 0; i<NUM_FRACTALS; i++) {
		if (glfwGetKey(winptr, 48+i) == GLFW_PRESS) {
			cfractal = fractalMap[i];
		}
	}
}

void resetFractal(struct Camera *cam)
{
	if (glfwGetKey(winptr, GLFW_KEY_R) == GLFW_PRESS) {
		camReset(cam);

	}
}
