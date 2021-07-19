import { getPotentialPoint } from '../../src/utils/chart';

const datetimes = [5, 10, 15, 20];
describe('getPotantialPoint for selecting timeLine chart', () => {

  it('should not select new right point(diff of current point and right point is not more than half of left point and nearest right point )', () => {
    const currentPoint = 6;
    const secondPoint = getPotentialPoint(datetimes, currentPoint);

    expect(secondPoint).toEqual(5);
  });
  it('should select new right point(diff of current point and right point is more than half of left point and nearest right point )', () => {
    const currentPoint = 8;
    const secondPoint = getPotentialPoint(datetimes, currentPoint);

    expect(secondPoint).toEqual(10);
  });
  it('should not select new left point(diff of current point and left point is not more than half of left point and nearest right point )', () => {
    const currentPoint = 9;
    const secondPoint = getPotentialPoint(datetimes, currentPoint);

    expect(secondPoint).toEqual(10);
  });
  it('should select new left point(diff of current point and left point is more than half of left point and nearest right point )', () => {
    const currentPoint = 7;
    const secondPoint = getPotentialPoint(datetimes, currentPoint);

    expect(secondPoint).toEqual(5);
  });
  it('if right point does not exist', () => {
    const currentPoint = 21;
    const secondPoint = getPotentialPoint(datetimes, currentPoint);
    expect(secondPoint).toEqual(20);
  });
  it('if left point does not exist', () => {
    const currentPoint = 4;
    const secondPoint = getPotentialPoint(datetimes, currentPoint);
    expect(secondPoint).toEqual(5);
  });
  it('should throw exception if dateTimes is Empty', () => {
    function getValueFromEmptyArray() {
      const currentPoint = 4;
      return getPotentialPoint([], currentPoint);
    }

    expect(getValueFromEmptyArray).toThrowErrorMatchingSnapshot();
  });
});
