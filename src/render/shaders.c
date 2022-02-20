#include "util.h"


int getShaderSource(const char *shaderpath, char **shaderSource)
{
	FILE *sfp;
	if (fopen_s(&sfp, shaderpath, "r") != 0 || sfp == NULL) {
		printf("ERROR > %s was unable to be opened!\n", shaderpath);
		exit(EXIT_FAILURE);
	}

	size_t size;
	fseek(sfp, 0, SEEK_END);
	size = ftell(sfp);

	fseek(sfp, 0, SEEK_SET);
	*shaderSource = (char *)calloc(sizeof(char), size+1);
	fread(*shaderSource, size, sizeof(char), sfp);

	fclose(sfp);
	return 1;
}

GLuint compileShader(GLuint programID, char *shaderSrc, GLenum type)
{
	const char *shaderType = type==GL_VERTEX_SHADER ? "Vertex Shader" : "Fragment Shader";
	if (shaderSrc == NULL) {
		printf("ERROR > GLSL shader source %s incomplete during compilation\n", shaderType);
		exit(EXIT_FAILURE);
	}

	GLint length = (GLint)strlen(shaderSrc);
	GLuint shaderID = glCreateShader(type);
	glShaderSource(shaderID, 1, (const char **)&shaderSrc, &length);
	free(shaderSrc);

	glCompileShader(shaderID);

	// POSSIBLE ERROR, glGetShaderiv(shaderID, GL_COMPILE_STATUS, &result);
	int infoLogLength;
	glGetShaderiv(shaderID, GL_INFO_LOG_LENGTH, &infoLogLength);

	if (infoLogLength > 0) {
		GLchar *infoLog = (GLchar *)calloc(1, infoLogLength);
		glGetShaderInfoLog(shaderID, infoLogLength, NULL, infoLog);
		printf("ERROR > %s compilation error\n%s\n", shaderType, infoLog);

		free(infoLog);
		exit(EXIT_FAILURE);
	}

	glAttachShader(programID, shaderID);
	return shaderID;
}

void getProgramInfoLog(GLuint programID)
{
	int infoLogLength;
	glGetProgramiv(programID, GL_INFO_LOG_LENGTH, &infoLogLength);
	if (infoLogLength > 0) {
		GLchar *infoLog = (GLchar *)calloc(1, infoLogLength);
		glGetProgramInfoLog(programID, infoLogLength, NULL, infoLog);
		printf("ERROR > Shader Program Compilation error\n%s\n", infoLog);
	}
}

GLuint loadShaders(const char *vertexShader, const char *fragmentShader)
{
	char *vertexSource = NULL;
	char *fragmentSource = NULL;
	
	GLuint programID;
	if (getShaderSource(vertexShader, &vertexSource) && getShaderSource(fragmentShader, &fragmentSource)) {
		programID = glCreateProgram();
		GLuint vertexID = compileShader(programID, vertexSource, GL_VERTEX_SHADER);
		GLuint fragmentID = compileShader(programID, fragmentSource, GL_FRAGMENT_SHADER);

		glLinkProgram(programID);
		getProgramInfoLog(programID);

		glDetachShader(programID, vertexID);
		glDetachShader(programID, fragmentID);

		glDeleteShader(vertexID);
		glDeleteShader(fragmentID);

	}
	else programID = 0;

	return programID;
}

void uniformMat4(GLuint programID, float *matrix, const char *varName)
{
	GLuint ref = glGetUniformLocation(programID, varName);
	glUniformMatrix4fv(ref, 1, GL_FALSE, matrix);
};

void uniformVec2(GLuint programID, GLsizei count, float *vec, const char *varName) 
{
	GLuint ref = glGetUniformLocation(programID, varName);
	glUniform2fv(ref, count, vec);
}

void uniformVec3(GLuint programID, GLsizei count, float *vec, const char *varName) 
{
	GLuint ref = glGetUniformLocation(programID, varName);
	glUniform3fv(ref, count, vec);
}

void uniformUInt(GLuint programID, GLuint val, const char *varName)
{
	GLuint ref = glGetUniformLocation(programID, varName);
	glUniform1ui(ref, val);
}