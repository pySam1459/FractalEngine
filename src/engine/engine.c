#include "engine.h"

Engine engine;

void engInit() 
{
	engine.quad = quadCreate();
	engine.cam = camCreate();
}

void engRun() 
{
	while (!glfwWindowShouldClose(winptr) && !glfwGetKey(winptr, GLFW_KEY_ESCAPE)) {
		glfwPollEvents();

		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
		glClearColor(1.0f, 1.0f, 1.0f, 1.0f);

		pickFractal();
		resetFractal(&engine.cam);
		
		camUpdate(&engine.cam, engine.quad.shaderID);
		quadRender(engine.quad);

		glfwSwapBuffers(winptr);
	}
}

void engDestroy() 
{
	quadDestroy(engine.quad);
}
