#include "camera.h"

const float speed = 0.017;
const float zoom = 1.01;

struct Camera camCreate()
{
	struct Camera cam;
	camReset(&cam);

	return cam;
}

void camUpdate(struct Camera *cam, GLuint shaderID) {
	double xpos, ypos;
	glfwGetCursorPos(winptr, &xpos, &ypos);

	if (glfwGetKey(winptr, GLFW_KEY_W) == GLFW_PRESS) {
		cam->pos[1] += speed/cam->pos[2];
	} if (glfwGetKey(winptr, GLFW_KEY_A) == GLFW_PRESS) {
		cam->pos[0] -= speed/cam->pos[2];
	} if (glfwGetKey(winptr, GLFW_KEY_S) == GLFW_PRESS) {
		cam->pos[1] -= speed/cam->pos[2];
	} if (glfwGetKey(winptr, GLFW_KEY_D) == GLFW_PRESS) {
		cam->pos[0] += speed/cam->pos[2];
	} if (glfwGetKey(winptr, GLFW_KEY_E) == GLFW_PRESS) {
		cam->pos[2] *= zoom;
	} if (glfwGetKey(winptr, GLFW_KEY_Q) == GLFW_PRESS) {
		cam->pos[2] /= zoom;
	}
	uniformVec3(shaderID, 1, cam->pos, "offset");
	uniformVec2(shaderID, 1, (vec2) { (float)WIDTH*10, (float)HEIGHT*10 }, "dim");
	
}

void camReset(struct Camera *cam)
{
	if (cfractal == mandelbrot || cfractal == multibrot || cfractal == cubebrot)
		glm_vec3_copy((vec3) { -2.5f, -2.0f, 1.0f }, cam->pos);
	//else if (cfractal == newton)
	//	glm_vec3_copy((vec3) { -2.0f, -2.0f, 1.0f }, cam->pos);
	else if (cfractal == reciprocal)
		glm_vec3_copy((vec3) { -5.0f, -5.0f, 2.0f }, cam->pos);
}
