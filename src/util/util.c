#ifndef UTIL_H
#define UTIL_H

#include "util.h"

void mallocError(const char *errMsg) 
{
	printf("Error, Malloc returned a NULL pointer : %s\n", errMsg);
	glfwTerminate();
	exit(EXIT_FAILURE);
}

void exitError(const char *errMsg)
{
	printf(errMsg);
	glfwTerminate();
	exit(EXIT_FAILURE);
}

#endif // UTIL_H