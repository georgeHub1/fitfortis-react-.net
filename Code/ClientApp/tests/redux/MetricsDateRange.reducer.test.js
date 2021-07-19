import metricsDateRange from '../../src/redux/metricsDateRange.reducer.js';
import { createReducer } from '../../src/utils/common';

describe('AUTH', () => {
  it('should be loading', () => {
    const action = { type: 'SET_METRICS_DATE_RANGE', payload: 'test' };
    const initialState = 'test';

    expect(
      createReducer(metricsDateRange)(undefined, action)
    ).toEqual(initialState);
  });
});
