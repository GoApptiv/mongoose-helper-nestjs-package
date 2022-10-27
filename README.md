# GoApptiv Mongoose Helper NestJS

This package provides additional utility functions for mongoose like Paginator, MongoParamId decorator and much more

## Installation

1. Create a `.npmrc` in the root folder and add the following lines.

```bash
//npm.pkg.github.com/:_authToken=TOKEN
@goapptiv:registry=https://npm.pkg.github.com/
```

2. Create a personal token with **read:packages** permission and replace the `TOKEN` with your personal token in the above mentioned file.

3. Install the package using the following command

```bash
npm install @goapptiv/mongoose-helper-nestjs
```

## Usage

### MongoIDParam Decorator

This decorator helps to validate the param which is of type Mongo Object Id

```ts
import { MongoIdParam } from '@goapptiv/mongoose-helper-nestjs';

/**
 * find a customer by id
 */
@Get('id/:id')
@AuthGuard(Role.ADMIN, Role.HQ_MANAGER)
@HqGuard(HqGuardPath.PARAMS, 'id')
async findById(
  @MongoIdParam('id') id: string, // <------
  @Query('imageUrls') imageUrls: string,
): Promise<ResponseSuccess | ResponseError> {
  const withImages = imageUrls === 'true' ? true : false;

  const customer = await this.customerService.findById(
    new MongooseTypes.ObjectId(id),
    withImages,
  );
  return RestResponse.success(customer);
}
```

### Paginator

```ts
import { GaBaseRepository } from '@goapptiv/mongoose-helper-nestjs';

export class CustomerRepository extends GaBaseRepository<Customer> {
 ...

  fetch(
    filters: FetchFiltersDAO,
    paginateOptions: PaginateOptions,
  ): Promise<PaginateResult<Customer>> {
    return this.aggregatePaginate(aggregateQuery, paginateOptions);
  }
}
```
