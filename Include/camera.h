#ifndef CAMERA_H
#define CAMERA_H

#include <cglm/vec3.h>
#include <cglm/mat4.h>
#include <cglm/affine.h>

#include "util.h"
#include "window.h"
#include "shaders.h"
#include "fractal.h"

struct Camera {
	vec3 pos;
};

struct Camera camCreate();

void camUpdate(struct Camera *cam, GLuint shaderID);

void camReset(struct Camera *cam);

#endif CAMERA_H