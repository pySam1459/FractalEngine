#ifndef QUAD_H
#define QUAD_H

#include <cglm/vec2.h>

#include "util.h"
#include "shaders.h"
#include "window.h"
#include "fractal.h"

#define NEWTON_ROOTS 5


struct Quad {
	GLuint vaoID, vboID;
	GLuint shaderID;
};

struct Quad quadCreate();
void quadDestroy(struct Quad quad);

void quadRender(struct Quad quad);

#endif // QUAD_H
