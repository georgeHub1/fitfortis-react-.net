import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Icon } from 'antd';
import emoji1 from '../../img/emoji/emoji1.png';
import emoji2 from '../../img/emoji/emoji2.png';
import emoji3 from '../../img/emoji/emoji3.png';
import emoji4 from '../../img/emoji/emoji4.png';
import emoji5 from '../../img/emoji/emoji5.png';
import emoji1Active from '../../img/emoji/emoji1_active.png';
import emoji2Active from '../../img/emoji/emoji2_active.png';
import emoji3Active from '../../img/emoji/emoji3_active.png';
import emoji4Active from '../../img/emoji/emoji4_active.png';
import emoji5Active from '../../img/emoji/emoji5_active.png';
import PropTypes from 'prop-types';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';

const pattern = new RegExp(/^(-{0,1})(\d{1,})(\.\d{0,})*$/);

export default class HomeUnitStressLevelEntry extends Component {
	static propTypes = {
		stressLavel: PropTypes.func.isRequired
	};
	constructor (props) {
		super(props);
		this.state = {
			stressLevelValue: ''
		};
	}
	handleSaveStress = () => {
		const { stressLevelValue } = this.state;

		this.props.stressLavel(stressLevelValue);
		analyticId.firebaseAnalyticsLog('Home_UnitPsychologicalStress_ClickSave', {valueHappiness: stressLevelValue});
	}
	render () {
		const { stressLavelLoading } = this.props;
		const { stressLevelValue } = this.state;

		return (
			<div className="weight_units_col">
				<div className="weight_initial_state">
					<h4><FormattedMessage id="HomeUnitStressLevelEntry.StressLevel" /></h4>
					<div className="stress_buttons">
						<Button onClick={() => this.setState({ stressLevelValue: -200 })} className={stressLevelValue === -200 ? 'stress_button five active' : 'stress_button five'}>
							<img alt="emoji" src={emoji5} />
							<img alt="emoji" src={emoji5Active} className="active" />
						</Button>
						<Button onClick={() => this.setState({ stressLevelValue: -100 })} className={stressLevelValue === -100 ? 'stress_button four active' : 'stress_button four'}>
							<img alt="emoji" src={emoji4} />
							<img alt="emoji" src={emoji4Active} className="active" />
						</Button>
						<Button onClick={() => this.setState({ stressLevelValue: 0 })} className={stressLevelValue === 0 ? 'stress_button three active' : 'stress_button three'}>
							<img alt="emoji" src={emoji3} />
							<img alt="emoji" src={emoji3Active} className="active" />
						</Button>
						<Button onClick={() => this.setState({ stressLevelValue: 100 })} className={stressLevelValue === 100 ? 'stress_button two active' : 'stress_button two'}>
							<img alt="emoji" src={emoji2} />
							<img alt="emoji" src={emoji2Active} className="active" />
						</Button>
						<Button onClick={() => this.setState({ stressLevelValue: 200 })} className={stressLevelValue === 200 ? 'stress_button one active' : 'stress_button one'}>
							<img alt="emoji" src={emoji1} />
							<img alt="emoji" src={emoji1Active} className="active" />
						</Button>
					</div>
					<Button
						type="primary"
						disabled={!pattern.test(this.state.stressLevelValue) ? !pattern.test(this.state.stressLevelValue) : ''}
						onClick={() => this.handleSaveStress()}
						className="weight_form_button"
					>
						{stressLavelLoading
							? <Icon type="loading" />
							: <span><FormattedMessage id="HomeUnitStressLevelEntry.Save" /></span>
						}
					</Button>
				</div>
			</div>
		);
	}
}
