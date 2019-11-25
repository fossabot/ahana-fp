export class NoSuchElementException extends Error {
  message: '';
  name: string;

  constructor(message: string = '') {
    super(message);
    Object.setPrototypeOf(this, NoSuchElementException.prototype);
  }
}
