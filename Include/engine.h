#ifndef ENGINE_H
#define ENGINE_H

#include "util.h"
#include "window.h"
#include "camera.h"
#include "quad.h"
#include "shaders.h"
#include "fractal.h"

typedef struct {
	struct Quad quad;
	struct Camera cam;
} Engine;

extern Engine engine;

void engInit();

void engRun();

void engDestroy();

#endif // ENGINE_H