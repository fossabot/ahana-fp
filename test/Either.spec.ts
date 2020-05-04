import chai, {expect} from 'chai';
import chaiAsPromises from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import {Either} from '../src/Either';
import {Optional} from '../src/Optional';

chai.use(sinonChai);
chai.use(chaiAsPromises);

describe('Either', () => {
  it('maps Optionals correctly (right)', async () => {
    const e = Either.right(1);
    e.mapRight(d => Optional.of(d)).apply(
      () => {
        expect.fail();
      },
      f => {
        expect(f).to.equal(1);
      }
    );
  });
  it('maps Optionals correctly (left)', async () => {
    const e = Either.left(1);
    e.mapLeft(d => Optional.of(d)).apply(
      f => {
        expect(f).to.equal(1);
      },
      () => {
        expect.fail();
      }
    );
  });
});
