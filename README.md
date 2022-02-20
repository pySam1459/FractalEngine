# Fractal Engine

This is a OpenGL Rendering Engine for fractals, written in C.
Currently, only the Mandelbrot Set is fully supported as Newton's fractal wouldn't stop throwing errors.

## Controls
WASD moves the fractal in the x-y plane <br/>
EQ zooms/unzooms into/out-of the fractal plane. <br/>
The controls are slightly fiddly due to a not exact 1-1 map from screen space to world space.

## Details
OpenGL program written in C using Visual Studio 2019. <br/>
Glew 2.2, GLFW 3, OpenGL 4.5 (can be modified in window.c as version minor), cglm (N/A)
