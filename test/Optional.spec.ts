import {expect} from 'chai';
import {Optional} from '../src/Optional';

describe('Optional', () => {
  it('represents a value which is possibly set', () => {
    const data = Optional.of(1);
    expect(data.get()).to.equal(1);
  });

  describe('#isPresent', () => {
    it('reports when a value is present in the Optional', () => {
      const data = Optional.of(1);
      expect(data.isPresent()).to.be.true;
    });
    it('reports when a value is not present in the Optional', () => {
      const data = Optional.empty();
      expect(data.isPresent()).to.be.false;
    });
  });
  describe('#equals', () => {
    it('compares two Optionals with identical values as equal', () => {
      expect(Optional.of(1).equals(Optional.of(1))).to.be.true;
    });
    it('compares two Optionals with different values as not equal', () => {
      expect(Optional.of(1).equals(Optional.of(2))).to.be.false;
    });
    it('compares two empty Optionals as not equal', () => {
      expect(Optional.empty().equals(Optional.empty())).to.be.false;
    });
    it('compares two Optionals with identical complex values as equal', () => {
      expect(
        Optional.of({id: 1, age: 3}).equals(
          Optional.of({id: 1, age: 4}),
          (a, b) => a.id === b.id
        )
      ).to.be.true;
    });
  });
});
