import { HttpException, HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export function throwException(type: string, statusCode: HttpStatus, errorMessage: any) {
    const errorResponse = {
        statusCode: statusCode,
        status: "Failure",
        error: errorMessage,
    };

    if (type === 'rpc') {
        console.log("RPCEXCEPTION")
        throw new RpcException(new HttpException(errorResponse, statusCode));
    } else {
        console.log("HTTPEXCEPTION")
        throw new HttpException(errorResponse, statusCode);
    }
}
