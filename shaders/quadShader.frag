#version 450 core

out vec3 color;

uniform uint fractalType;

uniform vec3 offset;
uniform vec2 dim;



double dist(dvec2 a, dvec2 b) { return sqrt((a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y)); }
dvec2 conjugate(dvec2 a) { return dvec2(a.x, -a.y); }
double magnitude2(dvec2 a) { return a.x*a.x + a.y*a.y; }


dvec2 imAdd(dvec2 a, dvec2 b) { return dvec2(a.x+b.x, a.y+b.y); }
dvec2 imSub(dvec2 a, dvec2 b) { return dvec2(a.x-b.x, a.y-b.y); }
dvec2 imMul(dvec2 a, dvec2 b) { return dvec2(a.x*b.x-a.y*b.y, a.x*b.y + a.y*b.x); }

dvec2 imDiv(dvec2 a, dvec2 b)
{
	double mag = magnitude2(b);
	dvec2 c = imMul(a, conjugate(b));
	return dvec2(c.x/mag, c.y/mag);
}

float modu(float a, float b)
{
	int n = int(a / b);
	return a - n * b;
}

vec3 getCol(int i, int tot)
{
	if(i == tot)
		return vec3(0, 0, 0);

	float H = (360.0 * i) / tot;
	float C = 0.75; // V * S
	float X = C * (1 - abs(modu(H/60.0, 2.0)-1));
	vec3 m = vec3(0.75-C);
	
	H = modu(H+240.0, 360.0);
	if(0.0 <= H && H < 60.0)
		return vec3(C, X, 0) + m;
	else if(60.0 <= H && H < 120.0)
		return vec3(X, C, 0) + m;
	else if(120.0 <= H && H < 180.0)
		return vec3(0, C, X) + m;
	else if(180.0 <= H && H < 240.0)
		return vec3(0, X, C) + m;
	else if(240.0 <= H && H < 300.0)
		return vec3(X, 0, C) + m;
	else if(300.0 <= H && H <= 360.0)
		return vec3(C, 0, X) + m;
}

vec2 getXY() 
{
	float x = 4.0 * (gl_FragCoord.x) / (dim.x*offset.z) + offset.x;
	float y = 4.0 * (gl_FragCoord.y) / (dim.y*offset.z) + offset.y;
	return vec2(x, y);
}

// MANDELBROT 

vec3 mandelbrot()
{
/* HIGHER PRECISION, SLOWER CALCULATIONS => LESS ITERATION PRECISION
	double x = 4.0 * (gl_FragCoord.x) / (dim.x*offset.z) + offset.x;
	double y = 4.0 * (gl_FragCoord.y) / (dim.y*offset.z) + offset.y;
	
	dvec2 z = dvec2(0, 0);
	dvec2 c = dvec2(x, y);

	int tot = min(50 + int(offset.z), 100);
	int i=0;
	while(i<tot && z.x*z.x+z.y*z.y<4.0) {
		z = dvec2(z.x*z.x - z.y*z.y + c.x, 2 * z.x*z.y + c.y);
		i++;
	}
	return getCol(i, tot);
*/

	vec2 z = vec2(0, 0);
	vec2 c = getXY();

	int tot = min(50 + int(offset.z), 200);
	int i=0;
	while(i<tot && z.x*z.x+z.y*z.y<4.0) {
		z = vec2(z.x*z.x - z.y*z.y + c.x, 2 * z.x*z.y + c.y);
		i++;
	}
	return getCol(i, tot);
}

// Reciprocal?

vec3 reciprocal() 
{
	dvec2 z = dvec2(0, 0);
	dvec2 c = getXY();

	int tot = 10;
	int i=0;
	dvec2 a, b;
	while(i<tot && z.x*z.x + z.y*z.y<2.0) {
		a = dvec2(z.x*z.x*z.x-3*z.x*z.y*z.y+1, 3*z.x*z.x*z.y-z.y*z.y*z.y); 
		b = dvec2(c.x*(z.x*z.x+z.y*z.y)-2*z.x*z.y*c.y+1, 2*z.x*z.y*c.x + c.y*(z.x*z.x-z.y*z.y));
		z = imDiv(a, b);
		i++;
	}
	return getCol(i, tot);
}

// Multibrot?
vec3 multibrot() 
{
	dvec2 z = dvec2(0, 0);
	dvec2 c = getXY();

	int tot = min(50 + int(offset.z), 200);
	int i=0;
	dvec2 a, b;
	while(i<tot && z.x*z.x + z.y*z.y<4.0) {
		z = vec2(z.x*z.x*z.x-3*z.x*z.y*z.y+c.x, 3*z.x*z.x*z.y-z.y*z.y*z.y+c.y);
		i++;
	}
	return getCol(i, tot);
}

vec3 cubebrot() 
{
	dvec2 z = dvec2(0, 0);
	dvec2 c = getXY();

	int tot = min(50 + int(offset.z), 200);
	int i=0;
	double a, b;
	while(i<tot && z.x*z.x + z.y*z.y<4.0) {
		a = z.x*z.x*z.x-3*z.x*z.y*z.y-z.x*z.x-z.y*z.y+z.x+c.x;
		b = 3*z.x*z.x*z.y-z.y*z.y*z.y-2*z.x*z.y+z.y+c.y;
		z = dvec2(a, b);
		i++;
	}
	return getCol(i, tot);
}

// NEWTON

#define NUM_ROOTS 5
uniform dvec2 roots[NUM_ROOTS];
dvec2 deriv(dvec2 proots[NUM_ROOTS]) 
{
	for(int k=0; k<NUM_ROOTS; k++) {
		if(proots[k].x == 0 && proots[k].y == 0) {
			color = vec3(0);

		}
	}
	dvec2 cumlproots[NUM_ROOTS-1];
	cumlproots[NUM_ROOTS-2] = proots[NUM_ROOTS-1]; // cumulative mul proots
	for(int i=NUM_ROOTS-2; i>0; i--) {
		cumlproots[i-1] = imMul(proots[i], cumlproots[i]);
	}

	dvec2 res = dvec2(1, 0);
	for(int k=0; k<NUM_ROOTS-1; k++) {
		res = imAdd(cumlproots[NUM_ROOTS-2-k], imMul(proots[NUM_ROOTS-2-k], res));
	}

	return res;
}


vec3 newton()
{
	double x = 4.0 * (gl_FragCoord.x) / (dim.x*offset.z) + offset.x;
	double y = 4.0 * (gl_FragCoord.y) / (dim.y*offset.z) + offset.y;
	dvec2 xy = dvec2(x, y);

	// poly y = (x-r1)(x-r2)...(x-rn)
	
	dvec2 proots[NUM_ROOTS];
	
	dvec2 f  = dvec2(1, 0);
	dvec2 fp = dvec2(1, 0);
	for(int i=0; i<1; i++) {
		for(int r=2; r<NUM_ROOTS; r++) {
			proots[r] = imSub(xy, roots[r]); // [(x-r1), (x-r2), ..., (x-rn)]
			if(sqrt(magnitude2(proots[r])) < 0.1) {
				return getCol(r, NUM_ROOTS);
			}

			f = imMul(f, proots[r]);
		}
		fp = deriv(proots);
		xy = imSub(xy, imDiv(f, fp));
	} 

	double minval = dist(roots[0], xy);
	int index = 0;
	double d;
	for(int r=1; r<NUM_ROOTS; r++) {
		d = dist(roots[r], xy);
		if(d < minval) {
			index = r;
			minval = d;
		}
	}

	return getCol(index, NUM_ROOTS);
}


void main() 
{
	if(fractalType == 0)
		color = mandelbrot();
	else if(fractalType == 1)
		color = multibrot();
	else if(fractalType == 2)
		color = cubebrot();
	else if(fractalType == 3)
		color = reciprocal();
	else
		color = vec3(1, 1, 1);
}
