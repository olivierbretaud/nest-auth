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

  @ApiProperty({ example: 'Unauthorized' })
  message: string;

  @ApiProperty({ example: 'Unauthorized' })
  error: string;
}

export class ErrorBadRequestDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request' })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

export class ErrorForbiddenDto {
  @ApiProperty({ example: 403 })
  statusCode: number;

  @ApiProperty({ example: 'Forbidden' })
  message: string;

  @ApiProperty({ example: 'Forbidden' })
  error: string;
}

export class ErrorNotFoundDto {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: 'Resource not found' })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;
}

export class ErrorConflictDto {
  @ApiProperty({ example: 409 })
  statusCode: number;

  @ApiProperty({ example: 'Email already exists' })
  message: string;

  @ApiProperty({ example: 'Conflict' })
  error: string;
}

export class ErrorTooManyRequestsDto {
  @ApiProperty({ example: 429 })
  statusCode: number;

  @ApiProperty({ example: 'ThrottlerException: Too Many Requests' })
  message: string;

  @ApiProperty({ example: 'Too Many Requests' })
  error: string;
}

export class ErrorInternalErrorDto {
  @ApiProperty({ example: 500 })
  statusCode: number;

  @ApiProperty({ example: 'Internal server error' })
  message: string;

  @ApiProperty({ example: 'Internal Server Error' })
  error: string;
}

export const ApiErrors = (...errors: ErrorCode[]) => {
  const decorators = [];

  if (errors.includes('BAD_REQUEST'))
    decorators.push(ApiBadRequestResponse({ type: ErrorBadRequestDto }));

  if (errors.includes('UNAUTHORIZED'))
    decorators.push(ApiUnauthorizedResponse({ type: ErrorUnauthorizedDto }));

  if (errors.includes('FORBIDDEN'))
    decorators.push(ApiForbiddenResponse({ type: ErrorForbiddenDto }));

  if (errors.includes('NOT_FOUND'))
    decorators.push(ApiNotFoundResponse({ type: ErrorNotFoundDto }));

  if (errors.includes('CONFLICT'))
    decorators.push(ApiConflictResponse({ type: ErrorConflictDto }));

  if (errors.includes('TOO_MANY_REQUESTS'))
    decorators.push(ApiTooManyRequestsResponse({ type: ErrorTooManyRequestsDto }));

  if (errors.includes('INTERNAL_ERROR'))
    decorators.push(ApiInternalServerErrorResponse({ type: ErrorInternalErrorDto }));

  return applyDecorators(...decorators);
};