#include "window.h"
#include "engine.h"

int main()
{
	winInit();

	engInit();
	engRun();
	engDestroy();

	return 0;
}