import { Body } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { zodV3ToOpenAPI } from 'nestjs-zod';
import { ZodSchema } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

/**
 * Decorator de MÉTODO que documenta o body no Swagger a partir de um schema Zod.
 * Uso em conjunto com @ZodBody(schema) no parâmetro.
 */
export function ApiZodBody(schema: ZodSchema) {
  // Cast intermediário para evitar "Type instantiation is excessively deep"
  const openapi = zodV3ToOpenAPI(schema as never) as Record<string, unknown>;
  return ApiBody({ schema: openapi });
}

/**
 * Decorator de PARÂMETRO — atalho para @Body(new ZodValidationPipe(schema)).
 */
export function ZodBody(schema: ZodSchema): ParameterDecorator {
  return Body(new ZodValidationPipe(schema));
}
