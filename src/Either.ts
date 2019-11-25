import {Optional} from './Optional';

export class Either<L, R> {
  public static left<L, R>(value: L | Optional<L>): Either<L, R> {
    return new Either<L, R>(Optional.of(value), Optional.empty());
  }
  public static right<L, R>(value: R | Optional<R>): Either<L, R> {
    return new Either<L, R>(Optional.empty(), Optional.of(value));
  }

  private readonly left: Optional<L>;
  private readonly right: Optional<R>;

  private constructor(l: Optional<L>, r: Optional<R>) {
    this.left = l;
    this.right = r;
  }

  public isLeft() {
    return this.left.isPresent();
  }

  public getLeft(): L {
    return this.left.get();
  }

  public isRight() {
    return this.left.isPresent();
  }

  public getRight(): R {
    return this.right.get();
  }

  public map<T>(lFunc: (val: L) => T, rFunc: (val: R) => T): T {
    return this.left.map(lFunc).orElseGet(() => this.right.map(rFunc).get());
  }

  public mapLeft<T>(lFunc: (val: L) => T): Either<T, R> {
    return new Either(this.left.map(lFunc), this.right);
  }
  public mapRight<T>(rFunc: (val: R) => T): Either<L, T> {
    return new Either(this.left, this.right.map(rFunc));
  }

  public proceedLeft<T>(lFunc: (val: L) => Either<T, R>): Either<T, R> {
    if (this.left.isPresent()) {
      return lFunc(this.left.get());
    }

    return Either.right<T, R>(this.right.get());
  }

  public proceedRight<T>(rFunc: (val: R) => Either<L, T>): Either<L, T> {
    if (this.right.isPresent()) {
      return rFunc(this.right.get());
    }

    return Either.left<L, T>(this.left.get());
  }

  public async proceedRightAsync<T>(
    rFunc: (val: R) => Promise<Either<L, T>>
  ): Promise<Either<L, T>> {
    if (this.right.isPresent()) {
      return rFunc(this.right.get());
    }

    return Either.left<L, T>(this.left.get());
  }

  public static joinLeft<L, R>(either: Either<Either<L, R>, R>): Either<L, R> {
    if (either.isLeft()) {
      return either.getLeft();
    }
    return Either.right(either.getRight());
  }

  public static joinRight<L, R>(either: Either<L, Either<L, R>>): Either<L, R> {
    if (either.isRight()) {
      return either.getRight();
    }
    return Either.left(either.getLeft());
  }

  public apply(lFunc: (val: L) => void, rFunc: (val: R) => void): void {
    this.left.ifPresent(lFunc);
    this.right.ifPresent(rFunc);
  }
}
