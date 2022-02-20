#include "window.h"

const int WIDTH = 1080;
const int HEIGHT = 1080;
const char *TITLE = "Fractal Engine 2";
GLFWwindow *winptr = NULL;

void winInit()
{
	if (!glfwInit()) {
		printf("GLFW failed to Init!\n");
		goto error;
	}

	glfwWindowHint(GLFW_SAMPLES, 4);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 5);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
	glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);

	winptr = glfwCreateWindow(WIDTH, HEIGHT, TITLE, NULL, NULL);
	if (!winptr) {
		printf("GLFW window failed to Init!\n");
		goto error;
	}

	glfwMakeContextCurrent(winptr);

	glewExperimental = GL_TRUE;
	if (glewInit() != GLEW_OK) {
		printf("GLEW failed to Init!\n");
		goto error;
	}

	return;

error:
	glfwTerminate();
	exit(EXIT_FAILURE);
}