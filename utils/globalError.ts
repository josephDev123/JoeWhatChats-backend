export class GlobalError extends Error {
  statusCode: number;
  operational: boolean;
  constructor(
    msg: string,
    name: string,
    statusCode: number,
    operational: boolean,
    stack?: string
  ) {
    super(msg);
    this.operational = operational;
    this.statusCode = statusCode;
    this.name = name;
    this.stack = stack;
  }
}
