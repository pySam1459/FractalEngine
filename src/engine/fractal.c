#include "fractal.h"

const enum Fractal fractalMap[NUM_FRACTALS] = { mandelbrot, newton };
enum Fractal cfractal = mandelbrot;

void pickFractal() 
{
	for (int i = 0; i<NUM_FRACTALS-1; i++) { // only allowing mandelbrot currently
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
