#ifndef FRACTAL_H
#define FRACTAL_H

#include <cglm/vec3.h>

#include "util.h"
#include "window.h"
#include "camera.h"

#define NUM_FRACTALS 4

enum Fractal{ mandelbrot=0, multibrot=1, cubebrot=2, reciprocal=3};

static const enum Fractal fractalMap[NUM_FRACTALS];

extern enum Fractal cfractal;

void pickFractal();
void resetFractal(struct Camera *cam);

#endif //FRACTAL_H