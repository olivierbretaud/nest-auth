import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiConflictResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiProperty, ApiTooManyRequestsResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";

type ErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'TOO_MANY_REQUESTS'
  | 'INTERNAL_ERROR';

  export class ErrorUnauthorizedDto {
    @ApiProperty({ example: 401 })
    statusCode: number;
  
    @ApiProperty({ example: 'Invalid credentials' })
    message: string;
  
    @ApiProperty({ example: 'Unauthorized' })
    error: string;
  }


  export class ErrorResponseDto {
    @ApiProperty({ example: 401 })
    statusCode: number;
  
    @ApiProperty({ example: 'Invalid credentials' })
    message: string;
  
    @ApiProperty({ example: 'Unauthorized' })
    error: string;
  }

export const ApiErrors = (...errors: ErrorCode[]) => {
  const decorators = [];

  if (errors.includes('BAD_REQUEST'))
    decorators.push(ApiBadRequestResponse({ type: ErrorResponseDto }));

  if (errors.includes('UNAUTHORIZED'))
    decorators.push(ApiUnauthorizedResponse({ type: ErrorUnauthorizedDto }));

  if (errors.includes('FORBIDDEN'))
    decorators.push(ApiForbiddenResponse({ type: ErrorResponseDto }));

  if (errors.includes('NOT_FOUND'))
    decorators.push(ApiNotFoundResponse({ type: ErrorResponseDto }));

  if (errors.includes('CONFLICT'))
    decorators.push(ApiConflictResponse({ type: ErrorResponseDto }));

  if (errors.includes('TOO_MANY_REQUESTS'))
    decorators.push(ApiTooManyRequestsResponse({ type: ErrorResponseDto }));

  if (errors.includes('INTERNAL_ERROR'))
    decorators.push(ApiInternalServerErrorResponse({ type: ErrorResponseDto }));

  return applyDecorators(...decorators);
};