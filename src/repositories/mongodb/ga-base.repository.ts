import { Model, Aggregate, FilterQuery } from 'mongoose';
import { PaginateOptions } from 'src/interfaces/paginate-options.interface';
import { PaginateResult } from 'src/interfaces/paginate-result.interface';

export class GaBaseRepository<T> {
  model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * creates pagination for normal queries
   * @see
   */
  async paginate(
    query: FilterQuery<T>,
    options: PaginateOptions,
  ): Promise<PaginateResult<T>> {
    const q = this.model.find(query);

    const promise = q
      .skip(options.limit * (options.page - 1))
      .limit(options.limit);

    const [docs, total] = await Promise.all([
      promise.exec(),
      this.model.countDocuments(query),
    ]);

    const result: PaginateResult<T> = {
      result: docs,
      total,
      limit: options.limit,
      page: options.page,
      hasNextPage: this.hasNextPage(options.page, options.limit, total),
      hasPreviousPage: this.hasPreviousPage(options.page),
      totalPages: this.calculateTotalPages(total, options.limit),
    };

    return result;
  }

  /**
   * creates pagination for aggregated queries
   * @see https://github.com/aravindnc/mongoose-aggregate-paginate-v2/blob/master/lib/mongoose-aggregate-paginate.js
   */
  async aggregatePaginate(
    query: Aggregate<any[]>,
    options: PaginateOptions,
  ): Promise<PaginateResult<T>> {
    const q = this.model.aggregate(query.pipeline());

    const promise = q.facet({
      docs: [
        { $skip: options.limit * (options.page - 1) },
        { $limit: options.limit },
      ],
      total: [{ $count: 'count' }],
    });

    const [{ docs, total }] = await promise.exec();
    let count = 0;

    if (total.length > 0) {
      [{ count }] = total;
    }

    const result: PaginateResult<T> = {
      result: docs,
      total: count,
      limit: options.limit,
      page: options.page,
      hasNextPage: this.hasNextPage(options.page, options.limit, count),
      hasPreviousPage: this.hasPreviousPage(options.page),
      totalPages: this.calculateTotalPages(count, options.limit),
    };

    return result;
  }

  /**
   * calculates total pages
   */
  calculateTotalPages(total: number, limit: number) {
    return Math.ceil(total / limit) || 1;
  }

  /**
   * checks result for pagination has next page
   */
  hasNextPage(limit: number, currentPage: number, totalPages: number) {
    return currentPage * limit < totalPages;
  }

  /**
   *  checks result for pagination has previous page
   */
  hasPreviousPage(currentPage: number) {
    return currentPage > 1;
  }
}
