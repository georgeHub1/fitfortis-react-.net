export const isSsr = () => (
  !(typeof window !== 'undefined' && window.document && window.document.createElement
    && window.setTimeout)
);

export function isNumber (val) {
  return typeof val === 'number' && !isNaN(val);
}

export const isNumOrStr = value => {
  return isNumber(value) || typeof value === 'string';
};

export const getPotentialPoint = (dateTimes, currentPoint) => {
  if (!dateTimes.length)
    throw new Error('date time should have value');

  const rightPoints = dateTimes.filter(x => x >= currentPoint);
  const leftPoints = dateTimes.filter(x => x <= currentPoint);

  const rightPoint = rightPoints.length ? rightPoints[0] : leftPoints[leftPoints.length - 1];
  const leftPoint = leftPoints.length ? leftPoints[leftPoints.length - 1] : rightPoints[0];

  if (leftPoint === rightPoint)
    return leftPoint;

  const averagePoint = (leftPoint + rightPoint) / 2;

  return (averagePoint >= currentPoint) ? leftPoint : rightPoint;
};
