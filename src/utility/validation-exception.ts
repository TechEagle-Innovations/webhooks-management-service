import { RpcException } from '@nestjs/microservices';
import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';

export function exceptionFactory(errors: ValidationError[]) {
    const constraints = extractConstraints(errors);
    console.log("ERROR", constraints);
    // console.trace("children found", constraints);
    const httpExcept =new HttpException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        data: constraints,
    }, HttpStatus.BAD_REQUEST)

    return new RpcException(httpExcept);
}

export function extractConstraints(errors: ValidationError[]): any[] {
    let constraints = [];
    errors.forEach(error => {
        if (error.constraints) {
            Object.values(error.constraints).forEach(msg => constraints.push(msg));
        }
        if (error.children && error.children.length > 0) {
            constraints = constraints.concat(extractConstraints(error.children));
        }
    });
    return constraints;
}

