#ifndef FRACTAL_H
#define FRACTAL_H

#include <cglm/vec3.h>

#include "util.h"
#include "window.h"
#include "camera.h"

#define NUM_FRACTALS 2

enum Fractal{ mandelbrot=0, newton=1 };

static const enum Fractal fractalMap[NUM_FRACTALS];

extern enum Fractal cfractal;

void pickFractal();
void resetFractal(struct Camera *cam);

#endif //FRACTAL_H