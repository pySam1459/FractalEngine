#version 450 core

out vec3 color;

uniform uint fractalType;

uniform vec3 offset;
uniform vec2 dim;


// UTIL FUNCTIONS
float modu(float a, float b)
{
	int n = int(a / b);
	return a - n * b;
}

vec3 getColFromHue(int i, int tot)
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

	float x = 4.0 * (gl_FragCoord.x) / (dim.x*offset.z) + offset.x;
	float y = 4.0 * (gl_FragCoord.y) / (dim.y*offset.z) + offset.y;
	
	vec2 z = vec2(0, 0);
	vec2 c = vec2(x, y);

	int tot = min(50 + int(offset.z), 200);
	int i=0;
	while(i<tot && z.x*z.x+z.y*z.y<4.0) {
		z = vec2(z.x*z.x - z.y*z.y + c.x, 2 * z.x*z.y + c.y);
		i++;
	}
	return getColFromHue(i, tot);
}


// NEWTON

#define NUM_ROOTS 5
uniform dvec2 roots[NUM_ROOTS];

double dist(dvec2 a, dvec2 b) { return sqrt((a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y)); }
dvec2 conjugate(dvec2 a) { return dvec2(a.x, -a.y); }
double magnitude2(dvec2 a) { return a.x*a.x + a.y*a.y; }


dvec2 imAdd(dvec2 a, dvec2 b) { return dvec2(a.x+b.x, a.y+b.y); }
dvec2 imSub(dvec2 a, dvec2 b) { return dvec2(a.x-b.x, a.y-b.y); }
dvec2 imMul(dvec2 a, dvec2 b) { return dvec2(a.x*b.x-a.y*b.y, a.x*b.y + a.y*b.x); }

dvec2 imDiv(dvec2 a, dvec2 b)
{
	double mag = magnitude2(b);
	a = imMul(a, conjugate(b));
	return dvec2(a.x/mag, a.y/mag);
}

dvec2 deriv(dvec2 proots[NUM_ROOTS]) 
{
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

	// Renders roots 
	/*
	double md = 1, d2;
	int index2;
	bool near = false;
	for(int k=0; k<NUM_ROOTS; k++) {
		d2 = dist(xy, roots[k]);
		if(d2 < md) {
			near = true;
			index2 = k;
			md = d2;
		}
	} 
	if(near) {
		return vec3(0); 
	}
	*/
	// return near ? vec3(0) : vec3(1); 
	

	// poly y = (x-r1)(x-r2)...(x-rn)
	
	dvec2 proots[NUM_ROOTS];
	
	dvec2 f  = dvec2(1, 0);
	dvec2 fp = dvec2(1, 0);
	for(int i=0; i<15; i++) {
		for(int r=0; r<NUM_ROOTS; r++) {
			proots[r] = imSub(xy, roots[r]); // [(x-r1), (x-r2), ..., (x-rn)]
			if(sqrt(magnitude2(proots[r])) < 0.025)
				return getColFromHue(r, NUM_ROOTS);

			f = imMul(f, proots[r]);
		}
		//fp = deriv(proots);
		xy = imSub(xy, imDiv(f, fp));
	} 

	double minval = dist(roots[0], xy);
	int index = 0;
	double d;
	for(int r=0; r<NUM_ROOTS; r++) {
		d = dist(roots[r], xy);
		if(d < minval) {
			index = r;
			minval = d;
		}
	}

	return getColFromHue(index, NUM_ROOTS);
}


void main() 
{
	if(fractalType == 0)
		color = mandelbrot();
	else if(fractalType == 1)
		color = newton();
	else
		color = vec3(1, 1, 1);
}
