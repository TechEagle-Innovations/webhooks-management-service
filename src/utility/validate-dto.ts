import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import dayjs from 'dayjs';

/**
 * Generic function to validate an object against a DTO class.
 * @param dtoClass - The DTO class to validate against.
 * @param value - The object to validate.
 * @throws BadRequestException if validation fails.
 * @returns Validation result if it fails; undefined otherwise.
 */
export async function validateDto<T extends object>(
  dtoClass: new () => T,
  value: any,
): Promise<any> {
  // Convert plain object to class instance for validation using plainToInstance
  // console.log('validateDto', value);
  const object = plainToClass(dtoClass, value);

  const errors = await validate(object);
  // console.log('errors', errors);

  if (errors.length > 0) {
    // If there are validation errors, return a structured response
    const constraints = formatErrors(errors);
    console.log(constraints);

    return {
      status: 400,
      message: 'DTO Validation failed',
      data: constraints,
      // errors:errors
    };
  }
  
  return null; // If validation passes, nothing is returned
}

/**
 * Formats validation errors into a structured format with properties and constraints.
 * @param errors - ValidationError array.
 * @returns - An array of objects containing property names and their associated constraints.
 */
function formatErrors(errors: ValidationError[]): { property: string; constraints: string[] }[] {
  const constraintsList: { property: string; constraints: string[] }[] = [];

  function extractConstraints(error: ValidationError) {
    if (error.constraints) {
      // If constraints exist, add them to the list
      const propertyConstraints = {
        property: error.property,
        constraints: Object.values(error.constraints),
      };
      constraintsList.push(propertyConstraints);
    }
    if (error.children && error.children.length > 0) {
      // If there are child errors, recursively extract their constraints
      error.children.forEach(extractConstraints);
    }
  }

  // Traverse each top-level error and extract constraints
  errors.forEach(extractConstraints);

  return constraintsList;
}
