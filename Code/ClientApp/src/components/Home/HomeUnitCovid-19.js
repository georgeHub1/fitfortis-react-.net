import React, { Component } from 'react';
import HomeUnitCovidVisulization from './HomeUnitCovid-19Visulization';
import { injectIntl } from 'react-intl';
import { bindActionCreators } from 'redux';
import { loadSearchCity, getAllCountryData, getAllGlobalData, getSummaryData } from '../../redux/metricsChart.action';
import { connect } from 'react-redux';

class HomeUnitCovid extends Component {
    constructor (props) {
        super(props);
        this.state = {
            countryCode: '',
            stateCode: '',
            countryName: ''
        };
    }
    componentDidMount () {
        fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(res => {
            if (res.country && res.country_name) {
                this.props.getAllCountryData();
                this.props.getGlobalData();
                this.props.getSummaryData();
                if (res.country === 'US') {
                    this.setState({countryCode: res.country, countryName: res.region, stateCode: res.region_code });
                } else {
                    this.setState({countryCode: res.country, countryName: res.country_name });
                }
            }
        }).catch(err => err);
    }
    render ()  {
        const { searchData } = this.props.metricsChart;

        const { countryCode, countryName, stateCode } = this.state;

        return (
            <div className="weight_units_row covid_row">
                <div className="weight_units_col">
                    <div className="weight_initial_state">
                        {countryCode
                        && <HomeUnitCovidVisulization
                            countryCode={countryCode}
                            countryName={countryName}
                            searchList={searchData}
                            stateCode={stateCode}
                        />
                        }
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = ({ metricsChart }) => ({ metricsChart });

const mapDispatchToProps = dispatch => ({
    loadSearchCity: bindActionCreators(loadSearchCity, dispatch),
    getAllCountryData: bindActionCreators(getAllCountryData, dispatch),
    getGlobalData: bindActionCreators(getAllGlobalData, dispatch),
    getSummaryData: bindActionCreators(getSummaryData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(HomeUnitCovid));
