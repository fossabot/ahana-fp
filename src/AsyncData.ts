import {Optional} from './Optional';

export enum RemoteDataStatus {
  'NotAsked',
  'Loading',
  'Failure',
  'Success',
}

/**
 * This class represents data from a remote source that takes time to load.
 */
export class AsyncData<D, E = {}> {
  protected status: RemoteDataStatus = RemoteDataStatus.NotAsked;
  private readonly data: ReadonlyArray<D>;
  private readonly error: E;

  private constructor({
    status,
    data,
    error,
  }: {
    status: RemoteDataStatus;
    data?: ReadonlyArray<D>;
    error?: E;
  }) {
    this.status = status;
    if (data) {
      this.data = Object.freeze(data);
    }
    if (error) {
      this.error = error;
    }
  }

  static notAsked<D, E = {}>() {
    return new AsyncData<D, E>({
      status: RemoteDataStatus.NotAsked,
    });
  }

  static loading<D, E = {}>() {
    return new AsyncData<D, E>({
      status: RemoteDataStatus.Loading,
    });
  }

  static loaded<D, E = {}>(data: D[]) {
    return new AsyncData<D, E>({
      status: RemoteDataStatus.Success,
      data: Object.freeze(data),
    });
  }

  static errored<D, E = {}>(error: E) {
    return new AsyncData<D, E>({
      status: RemoteDataStatus.Failure,
      error,
    });
  }

  is(status: RemoteDataStatus) {
    return this.status === status;
  }

  isLoaded() {
    return (
      this.status === RemoteDataStatus.Success || this.status === RemoteDataStatus.Failure
    );
  }

  isEmpty() {
    const value = this.value();
    return value.length === 0 || (value.length === 1 && value[0] === null);
  }

  hasValue(value: D) {
    return this.isLoaded() && this.singleValue() === value;
  }

  value(): ReadonlyArray<D> {
    if (this.status === RemoteDataStatus.Success) {
      return this.data;
    }

    throw new Error('Trying to access RemoteData before it is ready');
  }

  singleValue(): D {
    if (this.status === RemoteDataStatus.Success) {
      if (this.data.length !== 1) {
        throw new Error('Data is not single-valued');
      }
      return this.data[0];
    }

    throw new Error('Trying to access RemoteData before it is ready');
  }

  getOptional(): Optional<D> {
    return Optional.of(this.data ? this.data[0] : undefined);
  }

  map<U>(
    callbackfn: (value: D, index: number, array?: ReadonlyArray<D>) => U
  ): AsyncData<U, E> {
    if (this.status === RemoteDataStatus.NotAsked) {
      return AsyncData.notAsked<U, E>();
    }

    if (this.status === RemoteDataStatus.Loading) {
      return AsyncData.loading<U, E>();
    }

    if (this.status === RemoteDataStatus.Failure) {
      return AsyncData.errored<U, E>(this.error);
    }

    return AsyncData.loaded(this.data.map(callbackfn));
  }

  mapValue<U>(
    callbackfn: (value: D, index: number, array?: ReadonlyArray<D>) => U
  ): ReadonlyArray<U> {
    return this.map(callbackfn).value();
  }

  filter(
    callbackfn: (value: D, index?: number, array?: ReadonlyArray<D>) => boolean
  ): AsyncData<D, E> {
    if (this.status === RemoteDataStatus.NotAsked) {
      return AsyncData.notAsked<D, E>();
    }

    if (this.status === RemoteDataStatus.Loading) {
      return AsyncData.loading<D, E>();
    }

    if (this.status === RemoteDataStatus.Failure) {
      return AsyncData.errored<D, E>(this.error);
    }

    return AsyncData.loaded(this.data.filter(callbackfn));
  }

  reduce<U>(
    callbackfn: (
      previousValue: U,
      currentValue: D,
      currentIndex: number,
      array: ReadonlyArray<D>
    ) => U,
    initialValue: U
  ): AsyncData<U, E> {
    if (this.status === RemoteDataStatus.NotAsked) {
      return AsyncData.notAsked<U, E>();
    }

    if (this.status === RemoteDataStatus.Loading) {
      return AsyncData.loading<U, E>();
    }

    if (this.status === RemoteDataStatus.Failure) {
      return AsyncData.errored<U, E>(this.error);
    }

    return AsyncData.loaded<U, E>([this.data.reduce<U>(callbackfn, initialValue)]);
  }

  find(
    predicate: (value: D, index: number, obj: ReadonlyArray<D>) => boolean,
    // tslint:disable-next-line:no-any
    thisArg?: any
  ): D | undefined {
    if (this.status !== RemoteDataStatus.Success) {
      throw new Error('Trying to access RemoteData before it is ready');
    }

    return this.value().find(predicate, thisArg);
  }

  findIndex(
    predicate: (value: D, index: number, obj: ReadonlyArray<D>) => boolean,
    // tslint:disable-next-line:no-any
    thisArg?: any
  ) {
    return this.value().findIndex(predicate, thisArg);
  }

  update(index: number, value: D) {
    const arr = this.value();
    if (index >= arr.length) {
      throw new RangeError(`Index ${index} is too large`);
    } else if (index < 0) {
      throw new RangeError(`Index ${index} is too small`);
    }

    return AsyncData.loaded(Object.assign([...arr], {[index]: value}));
  }

  concat(...items: (D | ConcatArray<D>)[]) {
    return AsyncData.loaded(this.value().concat(...items));
  }

  sort(compareFn?: (a: D, b: D) => number) {
    return this.value()
      .slice()
      .sort(compareFn);
  }

  get(index: number) {
    return this.value()[index];
  }

  remove(index: number) {
    return this.filter((_, i) => i !== index);
  }

  // noinspection JSUnusedGlobalSymbols
  all(predicate: (value: D, index: number, array: D[]) => boolean): boolean {
    return this.every(predicate);
  }
  every(predicate: (value: D, index: number, array: D[]) => boolean): boolean {
    return this.value().every(predicate);
  }

  any(predicate: (value: D, index: number, array: D[]) => boolean): boolean {
    return this.some(predicate);
  }
  some(predicate: (value: D, index: number, array: D[]) => boolean): boolean {
    return this.value().some(predicate);
  }
}
