import { TIMELINE_METRIC_ID } from '../../src/constants/metrics.js';
import { deleteMetricPointsBulk, deleteMetricPointsTimeLineBulk, setMetricPoints, upsertMetricPoints, upsertTimeLineMetricPoints } from '../../src/redux/metricsMetricData.reducer.utils.js';

const defaultState = {
  loading: false,
  error: null,
  byId: {}
}

describe('metricsMetricData.utils', () => {

  it('should delete metric data by dateTime', () => {
    const payload = [{
      value: 102,
      metricId: '00000000-0000-0000-0000-000000000009',
      userId: '10524ac0-af76-4c2e-c620-08d77cf3813c',
      id: '00000000-0000-0000-0000-000000000056',
      dateTime: 1
    },
    {
      value: 102,
      metricId: '00000000-0000-0000-0000-000000000010',
      userId: '10524ac0-af76-4c2e-c620-08d77cf3813c',
      id: '00000000-0000-0000-0000-000000000057',
      dateTime: 1
    }];

    const initialState = {
      byId: {
        '00000000-0000-0000-0000-000000000009': [{
          value: 102,
          metricId: '00000000-0000-0000-0000-000000000009',
          userId: '10524ac0-af76-4c2e-c620-08d77cf3813c',
          id: '00000000-0000-0000-0000-000000000056',
          dateTime: 1576414609000
        }]
        ,
        '00000000-0000-0000-0000-000000000010': [{
          value: 102,
          metricId: '00000000-0000-0000-0000-000000000010',
          userId: '10524ac0-af76-4c2e-c620-08d77cf3813c',
          id: '00000000-0000-0000-0000-000000000057',
          dateTime: 1
        }],
        '00000000-0000-0000-0000-00000000001': [{
          value: 102,
          metricId: '00000000-0000-0000-0000-00000000001',
          userId: '10524ac0-af76-4c2e-c620-08d77cf3813c',
          id: '00000000-0000-0000-0000-000000000058',
          dateTime: 1
        }],
        [TIMELINE_METRIC_ID]: [{
          value: 102,
          measurements: 3,
          labResults: 1,
          doctorVisits: 1,
          metricId: TIMELINE_METRIC_ID,
          userId: '10524ac0-af76-4c2e-c620-08d77cf3813c',
          id: '00000000-0000-0000-0000-000000000059',
          dateTime: 1
        }]
      }
    };

    const expectedState = {
      '00000000-0000-0000-0000-000000000009': [],
      '00000000-0000-0000-0000-000000000010': [],
      [TIMELINE_METRIC_ID]: [{
        value: 102,
        measurements: 1,
        labResults: 1,
        doctorVisits: 1,
        metricId: TIMELINE_METRIC_ID,
        userId: '10524ac0-af76-4c2e-c620-08d77cf3813c',
        id: '00000000-0000-0000-0000-000000000059',
        dateTime: 1
      }]
    }

    expect({ ...deleteMetricPointsBulk(payload, initialState.byId), ...deleteMetricPointsTimeLineBulk(payload, initialState.byId) }).toEqual(
      expectedState
    );
  });
  it('should set metric data and recalculate measuremants', () => {
    const action = {
      value: 102,
      metricId: '00000000-0000-0000-0000-000000000009',
      userId: '10524ac0-af76-4c2e-c620-08d77cf3813c',
      id: '00000000-0000-0000-0000-000000000056',
      dateTime: 1
    };

    const initialState = {
      '00000000-0000-0000-0000-000000000009': [],
      '00000000-0000-0000-0000-000000000010': [{
        value: 102,
        metricId: '00000000-0000-0000-0000-000000000010',
        userId: '10524ac0-af76-4c2e-c620-08d77cf3813c',
        id: '00000000-0000-0000-0000-000000000057',
        dateTime: 1
      }],
      [TIMELINE_METRIC_ID]: [{
        value: 102,
        measurements: 1,
        labResults: 1,
        doctorVisits: 1,
        metricId: TIMELINE_METRIC_ID,
        userId: '10524ac0-af76-4c2e-c620-08d77cf3813c',
        id: '00000000-0000-0000-0000-000000000059',
        dateTime: 1
      }
      ]
    };

    const expectedState = {
      '00000000-0000-0000-0000-000000000009': [{
        value: 102,
        metricId: '00000000-0000-0000-0000-000000000009',
        userId: '10524ac0-af76-4c2e-c620-08d77cf3813c',
        id: '00000000-0000-0000-0000-000000000056',
        dateTime: 1
      }],
      '00000000-0000-0000-0000-000000000010': [{
        value: 102,
        metricId: '00000000-0000-0000-0000-000000000010',
        userId: '10524ac0-af76-4c2e-c620-08d77cf3813c',
        id: '00000000-0000-0000-0000-000000000057',
        dateTime: 1
      }],
      [TIMELINE_METRIC_ID]: [{
        value: 102,
        measurements: 2,
        labResults: 1,
        doctorVisits: 1,
        metricId: TIMELINE_METRIC_ID,
        userId: '10524ac0-af76-4c2e-c620-08d77cf3813c',
        id: '00000000-0000-0000-0000-000000000059',
        dateTime: 1
      }]
    };
    expect(setMetricPoints(action, initialState)).toEqual(
      expectedState
    );
  });
  it('should set timeLineMetric data', () => {

    const initialState = {
      '00000000-0000-0000-0000-000000000009': [],
      '00000000-0000-0000-0000-000000000015': [{
        value: 102,
        metricId: '00000000-0000-0000-0000-000000000015',
        userId: '10524ac0-af76-4c2e-c620-08d77cf3813c',
        id: "00000000-0000-0000-0000-000000000041",
        dateTime: 1
      }],
      [TIMELINE_METRIC_ID]: [{
        value: 102,
        measurements: 1,
        labResults: 1,
        doctorVisits: 1,
        metricId: TIMELINE_METRIC_ID,
        userId: '10524ac0-af76-4c2e-c620-08d77cf3813c',
        id: '00000000-0000-0000-0000-000000000059',
        dateTime: 1
      }
      ]
    };

    const expectedState = {
      '00000000-0000-0000-0000-000000000009': [{
        value: 90,
        metricId: '00000000-0000-0000-0000-000000000009',
        userId: '10524ac0-af76-4c2e-c620-08d77cf3813c',
        id: "04d816af-507e-4a7f-c199-08d7bacf90d5",
        dateTime: 1
      }],
      '00000000-0000-0000-0000-000000000015': [],
      [TIMELINE_METRIC_ID]: [{
        value: 102,
        measurements: 1,
        labResults: 1,
        doctorVisits: 1,
        metricId: TIMELINE_METRIC_ID,
        userId: '10524ac0-af76-4c2e-c620-08d77cf3813c',
        id: '00000000-0000-0000-0000-000000000059',
        dateTime: 1
      }]
    };
    const old = [
      {
        dateTime: 1,
        metricId: "00000000-0000-0000-0000-000000000009",
        value: "90"
      }
      , {
        id: "00000000-0000-0000-0000-000000000041",
        dateTime: 1,
        metricId: "00000000-0000-0000-0000-000000000015",
        value: ""
      }
    ];

    const newValue = [{
      dateTime: 1,
      value: 90,
      metricId: "00000000-0000-0000-0000-000000000009",
      id: "04d816af-507e-4a7f-c199-08d7bacf90d5",
      userId: '10524ac0-af76-4c2e-c620-08d77cf3813c',
    }];

    const timeLineMetricData = upsertTimeLineMetricPoints({ old: old, new: newValue }, initialState);
    const metricData = upsertMetricPoints({ old: old, new: newValue }, initialState);

    const result = { ...metricData, ...timeLineMetricData };
    expect(result).toEqual(
      expectedState
    );
  });
});
