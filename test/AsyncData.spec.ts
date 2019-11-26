import {expect} from 'chai';
import {AsyncData} from '../src/AsyncData';

describe('AsyncData', () => {
  it('represents a remotely loaded piece of data', () => {
    const data = AsyncData.loaded([1, 2, 3, 4]);
    expect(data.value()).to.deep.equal([1, 2, 3, 4]);
  });
  it('can map data', () => {
    const data = AsyncData.loaded([1, 2, 3, 4]);
    expect(data.map(x => 2 * x).value()).to.deep.equal([2, 4, 6, 8]);
  });
  it('can filter data', () => {
    const data = AsyncData.loaded([1, 2, 3, 4]);
    expect(data.filter(x => x % 2 === 0).value()).to.deep.equal([2, 4]);
  });
  it('can reduce data', () => {
    const data = AsyncData.loaded([1, 2, 3, 4]);
    expect(data.reduce((a, x) => a + x, 0).value()).to.deep.equal([10]);
  });
});
