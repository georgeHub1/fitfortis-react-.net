import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import ChartAreaBar from '../Common/chartAreaBarChart';
import CustomCard from '../Common/CustomCard.js';
import { Input, Select, AutoComplete } from 'antd';
import styles from './styles.module.less';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCountryData, getCovidChartData } from '../../redux/metricsChart.action';
import _ from 'lodash';
const Option = AutoComplete.Option;

export class HomeUnitCovidVisulization extends PureComponent {
  static propTypes = {
		intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
	};
  constructor (props) {
    super(props);

    this.state = {
      valueAutoCmplt: '',
      chartData: [],
      autoCompleteOpen: false,
      selectState: '',
      searchItems: [],
      dataSource: [],
      selectValue: '',
      totalDeath: 0,
      totalActive: 0,
      summaryValue:'total',
      totalRecovered: 0,
      selectedKeyObj: null
    };
  }
  componentDidMount () {
    const { countryCode, countryName, stateCode, intl: { formatMessage }} = this.props;

    if (countryCode === 'US') {
      this.setState({valueAutoCmplt: `${countryName } \u2022 ${formatMessage({id: 'HomeUnitCovidVisulization.US'})}`, selectValue: stateCode});
      this.props.getCovidData(stateCode);
    } else {
      this.props.getCountryData(countryName);
      this.setState({selectValue: countryCode, valueAutoCmplt: `${countryName}`});
    }
  }
  componentDidUpdate (prevProps) {
      this.totalCases([]);
  }
  handleChange = (e, isFocus) => {
    if (e !== 'SHOW_ALL_ITEMS') {
      this.setState({ ...this.state, valueAutoCmplt: e, autoCompleteOpen: true});
    }
  };
  handleSelect = (e, opt, renderItems) => {
    this.setState({ autoCompleteOpen: false });
    const value = e.split(` \u2022 `);
    const selectedKey = renderItems.find(el => el.name === value[0]);

    if (selectedKey) {
      if (selectedKey.isState) {
        this.props.getCovidData(opt.key);
      } else  {
        this.props.getCountryData(value[0]);
      }
    }
    this.setState({ valueAutoCmplt: e, selectValue: opt.key, autoCompleteOpen: false });
  };

  getHighlightedText = (higlight, text) => {
    const value = higlight.split(` \u2022 `);
    const parts = text.split(new RegExp(`(${value[0]})`, 'gi'));

    return (
      <span key={text}>
        {parts.map((part, i) => {
          if (higlight) {
            return (
              <span
                key={i}
                style={
                  part.toLowerCase().indexOf(value[0].toLowerCase() || value[1].toLowerCase()) !== -1
                    ? { fontWeight: 'bold', backgroundColor: '#FCABF9' }
                    : {}
                }
              >
                {part}
              </span>
            );
          }
          return (
            <span
              key={i}
            >
              {part}
            </span>
          );
        })}
      </span>
    );
  };
  filter = (data, text) => {
    const value = text.split(` \u2022 `);

    return data.filter(item => {
      return item.name.toLowerCase().includes(value[0].toLowerCase());
    });
  }
  totalCases = data => {
    const { metricsChart } = this.props;
    const metricData =  _.orderBy(metricsChart.covidData, ['date'], ['desc']);
    const slectedData = metricData[0];
    const pastDate = metricData[1];
    const result = _.orderBy(metricsChart.globalData, ['date'], ['desc']);
    const selectGlobalData = result[0];
    const selectTommorowGlobalData = result[1];

    const { summaryValue, selectValue } = this.state;

    if (metricData.length) {
      if (summaryValue === 'new') {
        if (slectedData && slectedData.isState) {
          this.setState({
            ...this.state,
            totalActive: `+${slectedData.positiveIncrease + slectedData.hospitalizedIncrease} `,
            totalDeath: `+${slectedData.deathIncrease}`,
            totalRecovered: `+${slectedData.recovered - pastDate.recovered}`
          });
        } else if (slectedData && selectValue !== 'Global') {
          const summaryData = metricsChart.summaryData.find(el => el.CountryCode === selectValue);

          const active = summaryData.NewConfirmed;
          const death = summaryData.NewDeaths;
          const recovered = summaryData.NewRecovered;

          this.setState({
            ...this.state,
            totalActive: active >= 0 ? `+${active}` : `${active}`,
            totalDeath: death >= 0 ? `+${death}` : `${death}`,
            totalRecovered: recovered >= 0 ? `+${recovered}` : `${recovered}`
          });
        }
      } else if (summaryValue === 'total' && slectedData) {
        if (slectedData.isState) {
          this.setState({
            ...this.state,
            totalActive: slectedData.positive ? slectedData.positive + slectedData.hospitalizedCurrently : 0,
            totalDeath: slectedData.death ? slectedData.death : 0,
            totalRecovered: slectedData.recovered ? slectedData.recovered : 0
          });
        } else {
          const summaryData = metricsChart.summaryData.find(el => el.CountryCode === selectValue);

          const active = summaryData.TotalConfirmed;
          const death = summaryData.TotalDeaths;
          const recovered = summaryData.TotalRecovered;

          this.setState({
            ...this.state,
            totalActive: active >= 0 ? `+${active}` : `${active}`,
            totalDeath: death >= 0 ? `+${death}` : `${death}`,
            totalRecovered: recovered >= 0 ? `+${recovered}` : `${recovered}`
          });
        }
      }
    } else {
      this.setState({totalActive: 0, totalDeath: 0, totalRecovered: 0 });
    }
    if (result.length) {
      if (summaryValue === 'new') {
        if (selectValue === 'Global') {
          if (selectGlobalData) {
            const active = selectGlobalData.active - selectTommorowGlobalData.active;
            const death = selectGlobalData.deaths - selectTommorowGlobalData.deaths;
            const recovered = selectGlobalData.recovered - selectTommorowGlobalData.recovered;

            this.setState({
              ...this.state,
              totalActive: active >= 0 ? `+${active}` : `${active}`,
              totalDeath: death >= 0 ? `+${death}` : `${death}`,
              totalRecovered: recovered >= 0 ? `+${recovered}` : `${recovered}`
            });
          }
        }
      }
      if (summaryValue === 'total' && selectValue === 'Global' && selectGlobalData) {
        this.setState({
          ...this.state,
          totalActive: selectGlobalData.active,
          totalDeath: selectGlobalData.deaths,
          totalRecovered: selectGlobalData.recovered
        });
      }
    }
  }
  handleChangeOption = (value, selectValue) => {
    this.setState({summaryValue: value});
  }
  currentLocation = () => {
    const {
      intl: { formatMessage }
    } = this.props;

    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(res => {
            if (res.country && res.country_name) {
                if (res.country === 'US') {
                  this.setState({valueAutoCmplt: `${res.region} \u2022 ${formatMessage({id: 'HomeUnitCovidVisulization.US'})}`, selectValue: res.region_code, autoCompleteOpen: false});
                  this.props.getCovidData(res.region_code);
                } else {
                  this.props.getCountryData(res.country_name);
                  this.setState({selectValue: res.country, valueAutoCmplt: `${res.country_name}`, autoCompleteOpen: false});
                }
            }
        }).catch(err => err);
  }
  render () {
    const {
      searchList,
      intl: { locale, formatMessage },
      metricsChart
    } = this.props;

    let children = [];

    let keyValue = null;

    const { valueAutoCmplt, totalActive, totalDeath, totalRecovered, selectValue, summaryValue, autoCompleteOpen } = this.state;

    const filteredResult = (valueAutoCmplt !== '') ? this.filter(searchList, valueAutoCmplt) : [];

    let  data = metricsChart.covidData.length ? metricsChart.covidData : [];
    const renderItems = filteredResult;

    if (selectValue === 'Global') {
      data = metricsChart.globalData;
    }
    keyValue = 'Global';
    const childData = [];

    const child = <Option
        value={`${keyValue}`}
        key={`${keyValue}`}
      >
        <FormattedMessage id="HomeUnitCovidVisulization.global" />
    </Option>;

    childData.push(child);
    children = renderItems.map((item, i) => {
      const value = this.getHighlightedText(valueAutoCmplt, item.name);

      return (
        <Option
          value={item.isState ? `${item.name } \u2022 ${formatMessage({id: 'HomeUnitCovidVisulization.US'})}` : item.name}
          key={`${item.state}`}
        >
          <div className="stateName" ><span>{value}</span>{item.isState && <span className="itemState"><FormattedMessage id="HomeUnitCovidVisulization.US" /></span>}</div>
        </Option>
      );
    });
    const selected = valueAutoCmplt.split(' \u2022 ');

    return (
      <CustomCard
        title={<h1><FormattedMessage id="HomeUnitCovidVisulization.title" /></h1>}
        extra={
        <Select
          dropdownClassName="covidDropDown"
          size="large"
          value={summaryValue}
          onChange={value => this.handleChangeOption(value, selectValue)}
        >
          <Select.Option value="total">
            <FormattedMessage id="HomeUnitCovidVisulization.total" />
          </Select.Option>
          <Select.Option value="new">
            <FormattedMessage id="HomeUnitCovidVisulization.new" />
          </Select.Option>
        </Select>}
      >
        <div className="covidChartContainer">
          <div className="covidChartInput">
          <div className={!autoCompleteOpen ? 'selectedInput active' : 'selectedInput'} onClick={() => this.setState({ autoCompleteOpen: true })}>{selected[0]}{selected[1] && <span>{selected[1]}</span>}</div>
          <AutoComplete
              autocomplete="on"
              defaultActiveFirstOption={false}
              open={autoCompleteOpen}
              onBlur={() => this.setState({ autoCompleteOpen: false})}
              className={styles.searchInput}
              dropdownMatchSelectWidth={true}
              dataSource={[...childData, ...children]}
              optionLabelProp="value"
              value={valueAutoCmplt}
              onChange={e => this.handleChange(e, false)}
              onSelect={(e, opt) => { this.handleSelect(e, opt, renderItems); }}
              dropdownClassName="autocompleteEncyclopedia coronaCountryDropDown"
            >
              <Input
                className={styles.searchInput}
              />
            </AutoComplete>
            <svg onClick={() => this.currentLocation()} viewBox="64 64 896 896" focusable="false" data-icon="aim" width="1em" height="1em" fill="currentColor" aria-hidden="true"><defs><style></style></defs><path d="M952 474H829.8C812.5 327.6 696.4 211.5 550 194.2V72c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v122.2C327.6 211.5 211.5 327.6 194.2 474H72c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h122.2C211.5 696.4 327.6 812.5 474 829.8V952c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V829.8C696.4 812.5 812.5 696.4 829.8 550H952c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zM512 756c-134.8 0-244-109.2-244-244s109.2-244 244-244 244 109.2 244 244-109.2 244-244 244z"></path><path d="M512 392c-32.1 0-62.1 12.4-84.8 35.2-22.7 22.7-35.2 52.7-35.2 84.8s12.5 62.1 35.2 84.8C449.9 619.4 480 632 512 632s62.1-12.5 84.8-35.2C619.4 574.1 632 544 632 512s-12.5-62.1-35.2-84.8A118.57 118.57 0 00512 392z"></path></svg>
          </div>
          <div className="covidChartContaint">
            <div className="covidChart">
              <ChartAreaBar data={data} totalCases={this.totalCases} selectValue={selectValue} summaryValue={summaryValue} />
            </div>
            <div className="covidChartDetail">
              <div className="covidChartDetailBox">
                <span><FormattedMessage id="HomeUnitCovidVisulization.active" /></span>
              <h2>{summaryValue === 'new' && totalActive >= 0 && '+'}{Number(totalActive).toLocaleString(locale)}</h2>
              </div>
              <div className="covidChartDetailBox">
                <span><FormattedMessage id="HomeUnitCovidVisulization.recovered" /></span>
                <h2>{summaryValue === 'new' && totalRecovered >= 0 && '+'}{Number(totalRecovered).toLocaleString(locale)}</h2>
              </div>
              <div className="covidChartDetailBox">
                <span><FormattedMessage id="HomeUnitCovidVisulization.fatal" /></span>
                <h2>{summaryValue === 'new' && totalDeath >= 0 && '+'}{Number(totalDeath).toLocaleString(locale)}</h2>
              </div>
            </div>
          </div>
        </div>
      </CustomCard>
    );
  }
}

const mapStateToProps = ({ metricsChart }) => ({ metricsChart });

const mapDispatchToProps = dispatch => ({
  getCovidData: bindActionCreators(getCovidChartData, dispatch),
  getCountryData: bindActionCreators(getCountryData, dispatch)
});

export default  connect(mapStateToProps, mapDispatchToProps)(injectIntl(HomeUnitCovidVisulization));
