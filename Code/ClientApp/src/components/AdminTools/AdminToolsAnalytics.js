import React, { Component } from 'react';
import { Tag, Statistic, Form } from 'antd';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import { bindActionCreators } from 'redux';
import ChartAreaAnalyticsSparkline from '../Common/ChartAreaAnalyticsSparkline';
import { fetchAnalyticsDetails, getAnalyticDetails } from '../../redux/adminTool.action';
import { setMetricsDateRange } from '../../redux/metricsDateRange.action';
import CustomCard from '../Common/CustomCard.js';
import * as R from 'ramda';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';

class AdminToolsAnalytics extends Component {
  displayName = AdminToolsAnalytics.name
  constructor () {
    super();
    this.state = {};
  }

  componentDidMount () {
    analyticId.firebaseAnalyticsLog('AdminTools_Analytics');
  }
  componentWillMount () {
    const { intl: { locale } } = this.props;

    this.props.fetchAnalyticsDetails(locale);
    this.props.fetchAnalyticsUserDEtail(locale);
    this.props.setMetricsDateRange(this.dateRange());
  }

  dateRange = () => {
    const currentTime = new Date().getTime();

    return { from: currentTime - 2592000000, to: currentTime + 172800000, key: 'YEAR_KEY' };
  };

  render () {
    const { adminTool: { isAnalyticFetchingData, analyticData, analyticChartDetails, isAnalyticChartDetailsLoading }, metricsDateRange } = this.props;
    const data = analyticData !== null
    ? R.groupWith((a, b) => a.category === b.category, R.sort(R.ascend(R.prop('category')), R.clone(analyticData)))
    : [];

    return (
      <div className="AdminToolsAnalyticsSection">
        {
          (!isAnalyticFetchingData && !isAnalyticChartDetailsLoading)
          ? <div className="AdminToolsAnalyticsLeft">
            {
              data.map((items, index) => {
                return (
                  <CustomCard key={index}>
                    <div>
                      <div className="cardHeaderProfile">
                        { items[0].category }
                      </div>
                      <div className="containerTags adminToolTags">
                        <Form.Item>
                          {
                            R.groupWith((a, b) => a.name === b.name, R.sort(R.ascend(R.prop('name')), R.clone(items))).map((item, itemIndex) => {
                              return (
                                <Tag key={itemIndex} className='uncheckedTag'>
                                  {analyticChartDetails.find(x => x.analytic.id === item[0].analyticData.analyticId).analyticData.length === 0
                                    && <Statistic title={item[0].name} value={item[0].analyticData.value} />
                                  }
                                  {
                                    analyticChartDetails.find(x => x.analytic.id === item[0].analyticData.analyticId).analyticData.length > 0
                                    && <ChartAreaAnalyticsSparkline
                                      latestValue={item[0].analyticData.value}
                                      metricKey={item[0].analyticData.id}
                                      data={analyticChartDetails.find(x => x.analytic.id === item[0].analyticData.analyticId).analyticData}
                                      metricName={item[0].name}
                                      metricsDateRange={metricsDateRange}
                                    />
                                  }
                                </Tag>
                              );
                            })
                          }
                        </Form.Item>
                      </div>
                    </div>
                  </CustomCard>
                );
              })
            }
          </div>
          : <ReactLoading className="react-loading-center" type="spin" color="#335889"  />
        }
      </div>
    );
  }
}

const mapStateToProps = (({ adminTool, metricsDateRange }) => ({ adminTool, metricsDateRange }));

const mapDispatchToProps = dispatch => ({
  fetchAnalyticsDetails: bindActionCreators(fetchAnalyticsDetails, dispatch),
  fetchAnalyticsUserDEtail: bindActionCreators(getAnalyticDetails, dispatch),
  setMetricsDateRange: bindActionCreators(setMetricsDateRange, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AdminToolsAnalytics));

