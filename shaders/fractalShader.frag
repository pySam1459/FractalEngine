#version 450 core

layout(location=0) out vec3 color;

uniform vec2 upleft, botright;
uniform vec2 viewDim;

//uniform vec3 colors[50];

float mag(vec2 z)
{
	return z.x*z.x + z.y*z.y;
}

vec2 cpower(vec2 z, int p) 
{
	float r = mag(z);
	if(r == 0.0f) 
		return vec2(0, 0);
	
	if(z.x == 0.0f)
		return vec2(0, (2*(p%2)-1)*pow(z.y, p));

	if(z.y == 0.0f)
		return vec2(pow(z.x, p), 0);

	r = pow(r, p);
	float ptheta = p * atan(z.y/z.x);
	return vec2(r*cos(ptheta), r*sin(ptheta));
}


void main() 
{
	vec2 z = vec2(0, 0);
	float x = upleft.x + (botright.x - upleft.x) * gl_FragCoord.x / (viewDim.x-1);
	float y = upleft.y + (botright.y - upleft.y) * gl_FragCoord.y / (viewDim.y-1);
	vec2 c = vec2(x, y);

	int maxIter = 50;
	int i=0;
	while(i<maxIter && mag(z)<5.0f) {
		z = cpower(z, 2) + c;
		i++;
	}

	color = i >= maxIter ? vec3(0, 0, 0) : vec3(1, 1, 1);
	//color = i >= maxIter ? vec3(0, 0, 0) : colors[i%50-1];
}
