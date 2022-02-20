#ifndef SHADERS_H
#define SHADERS_H

#include "util.h"
#include <string.h>

GLuint loadShaders(const char *vertexShader, const char *fragmentShader);

void uniformMat4(GLuint programID, float *matrix, const char *varName);
void uniformVec2(GLuint programID, GLsizei count, float *vec, const char *varName);
void uniformVec3(GLuint programID, GLsizei count, float *vec, const char *varName);
void uniformUInt(GLuint programID, GLuint val, const char *varName);

#endif // SHADERS_H
