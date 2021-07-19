import PropTypes from 'prop-types';

export const MetricsChartDataProps = PropTypes.shape({
    stroke: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    chartMetricId: PropTypes.string.isRequired,
    showGoalLines: PropTypes.bool.isRequired,
    annotateLastEntry: PropTypes.bool.isRequired,
    annotateMaxEntry: PropTypes.bool.isRequired,
    annotateMinEntry: PropTypes.bool.isRequired,
    goal: PropTypes.number,
    yMin: PropTypes.number,
    yMax: PropTypes.number,

    metricId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    defaultStroke: PropTypes.string.isRequired,
    units: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.number.isRequired,

    metricData: PropTypes.arrayOf(
        PropTypes.shape({
            dateTime: PropTypes.number.isRequired,
            id: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired
        })
    )
}).isRequired;
