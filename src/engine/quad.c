#include "quad.h"

const float quadVertices[] = {
	-1.0f,  1.0f, 0.0f, 
	-1.0f, -1.0f, 0.0f,
	 1.0f,  1.0f, 0.0f,
	 1.0f, -1.0f, 0.0f,
	 1.0f,  1.0f, 0.0f,
	-1.0f, -1.0f, 0.0f
};

struct Quad quadCreate()
{
	struct Quad quad;
	glGenVertexArrays(1, &quad.vaoID);
	glBindVertexArray(quad.vaoID);

	glGenBuffers(1, &quad.vboID);
	glBindBuffer(GL_ARRAY_BUFFER, quad.vboID);
	glBufferData(GL_ARRAY_BUFFER, sizeof(quadVertices), quadVertices, GL_STATIC_DRAW);

	quad.shaderID = loadShaders("shaders/quadShader.vert", "shaders/quadShader.frag");

	return quad;
}

void quadDestroy(struct Quad quad)
{
	glDeleteVertexArrays(1, &quad.vaoID);
	glDeleteBuffers(1, &quad.vboID);
}

void loadUniforms(struct Quad quad) 
{
	uniformUInt(quad.shaderID, cfractal, "fractalType");
	uniformVec2(quad.shaderID, 1, (vec2) {(float)WIDTH, (float)HEIGHT}, "dim");
	/*
	if (cfractal == newton) {
		float roots[NEWTON_ROOTS*2];
		for(int k=0; k<NEWTON_ROOTS; k++) {
			roots[2*k] = cos(2.0f*k*GLM_PI/NEWTON_ROOTS);
			roots[2*k+1] = sin(2.0f*k*GLM_PI/NEWTON_ROOTS);
		}
		uniformVec2(quad.shaderID, NEWTON_ROOTS, roots, "roots");
	}*/
}

void quadRender(struct Quad quad)
{
	glBindVertexArray(quad.vaoID);
	glViewport(0, 0, WIDTH, HEIGHT);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 0, (void *)0);
	glEnableVertexAttribArray(0);

	glUseProgram(quad.shaderID);
	loadUniforms(quad);

	glBindVertexArray(quad.vaoID);
	glDrawArrays(GL_TRIANGLES, 0, 6);
	glDisableVertexAttribArray(0);
}
