import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class User{
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    userEmail:string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    projectName:string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    id:string;

   
}