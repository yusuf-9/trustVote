export default class CustomError extends Error {
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;

    // Set the prototype explicitly
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}