import { GaBadRequestException } from '@goapptiv/exception-handler-nestjs';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

export const MongoIdParam = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const id = request.params[key];

    if (!isValidObjectId(id)) {
      throw new GaBadRequestException([
        {
          type: 'E400_INVALID_ID',
          message: `${key} is invalid`,
          context: {
            [key]: id,
          },
        },
      ]);
    }

    return id;
  },
);
