import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { requestDtoMap, responseDtoMap } from 'src/app.topics';
import { extractConstraints } from 'src/utility/validation-exception';



@Injectable()
export class RequestResponseValidationInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler<any>) {

        const request = context.switchToHttp().getRequest();
        console.log('Incoming Request:', request.body);
        const kafkaMessage = context.getArgs()[0]; // Retrieve Kafka message from args
        const topicFromKafka = kafkaMessage?.topic; // Extract the topic from the Kafka message
        let requestValidationDto;
        let responseValidationDto;
        let defaultProtocol = "rpc";
        console.log('Kafka Topic:', topicFromKafka);
        if (topicFromKafka) {
            responseValidationDto = responseDtoMap[topicFromKafka];
            requestValidationDto = requestDtoMap[topicFromKafka],
                defaultProtocol = "rpc"
        } else {
            responseValidationDto = responseDtoMap[request.body.topic]
            requestValidationDto = requestDtoMap[request.body.topic],
                defaultProtocol = "http"
        }

        console.log("requestDto", requestValidationDto, "request.body", request.body)

        const transformedData: any = plainToInstance(requestValidationDto, topicFromKafka ? request : request.body);
        console.log("transformedData", transformedData, defaultProtocol);

        return validate(transformedData).then(errors => {
            if (errors.length > 0) {
                const constraints = extractConstraints(errors);
                const httpExcept = new HttpException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Request Validation failed',
                    error: constraints,
                }, HttpStatus.BAD_REQUEST)

                if (defaultProtocol === 'rpc') {
                    console.log("errorResponse", httpExcept);
                    return throwError(() => new RpcException(httpExcept));
                }

                return throwError(() => httpExcept);
            }
            return next.handle().pipe( 
                switchMap(async (data) => {
                    let res=data;
                    // if (!responseDtoMap) {
                    //     throw new Error('DTO is not defined');
                    // }
                //     if (typeof data !== 'object' || Array.isArray(data)) {
                //         throw new Error('Data is not in the correct format');
                //     }
                //    const resp = JSON.parse(JSON.stringify(data))
                    // console.log(data.data, 95, responseValidationDto,resp);

                    // console.log(data.data, 96, responseValidationDto,resp);
                    if(responseValidationDto){
                        const resp = JSON.parse(JSON.stringify(data))
                    const transformData: any = plainToInstance(responseValidationDto, resp, { excludeExtraneousValues: true });
                    // console.log("transformData", 98, transformData);
                    const errors: ValidationError[] = await validate(transformData);
                    res=defaultProtocol==="http"?transformData : instanceToPlain(transformData);
                    // console.log("transformData", 100, JSON.stringify(res));
                    console.log(errors);
                    if (errors.length > 0) {
                        const constraints = extractConstraints(errors);
                        // console.log("constraints", constraints)
                        const httpExcept = new HttpException({
                            statusCode: HttpStatus.BAD_REQUEST,
                            message: 'Response Validation failed',
                            error: constraints,
                        }, HttpStatus.BAD_REQUEST)

                        if (defaultProtocol === 'rpc') {
                            console.log("errorResponse", httpExcept);
                            res = new RpcException(httpExcept);
                            // return {status:HttpStatus.BAD_REQUEST, message:"Response Validation failed", data:constraints};
                        }
                        return httpExcept.getResponse();
                    }
                   
                }
                    return res; 
                 
                }),
                // catchError((error) => {
                //     console.error("Validation or Transformation Error:", error);
                //     return throwError(() => error);
                // })
            );
        });
    }
}
