import React, { Component } from 'react';
import { Form } from 'antd';
import { injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import CustomTag from '../Common/CustomTag';
import CustomCard from '../Common/CustomCard.js';
import styles from './styles.module.less';
import * as R from 'ramda';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';

class ProfileTherapyAndVaccines extends Component {
  static propTypes = {
    setTabValue: PropTypes.func
  };

  static defaultProps = {
    setTabValue: () => true
  };

  constructor (props) {
    super(props);
    this.state = {
      profileTherapyVaccine: props.profileTherapyVaccine
    };
  }

  componentDidMount () {
    analyticId.firebaseAnalyticsLog('Profile_TherapyAndVaccines');
  }
  componentDidUpdate ({profileTherapyVaccine}) {
    const { profileTherapyVaccine: profileTherapyVaccineProps  } = this.props;

    if (!R.equals(profileTherapyVaccine, profileTherapyVaccineProps))
      this.setState({
        profileTherapyVaccine: [...profileTherapyVaccineProps]
      });
  }

  onClickTag = (tag, key) => {
    const { setTabValue } = this.props;
    const { profileTherapyVaccine } = this.state;
    const dataVaccine = R.clone(profileTherapyVaccine);
    const newElem = R.assoc('isSelected', !tag.isSelected)(tag);

    const indexElem = R.indexOf(tag)(dataVaccine);

    dataVaccine.splice(indexElem, 1, newElem);
    this.setState({
      profileTherapyVaccine: [
        ...dataVaccine
      ]
    });
    setTabValue({
      profileTherapyVaccine: [
        ...dataVaccine
      ]
    });
  };


  render () {
    const profileTherapyVaccine = this.state.profileTherapyVaccine !== undefined
    ? R.groupWith((a, b) => a.key === b.key, R.sortBy(R.prop('key'), R.clone(this.state.profileTherapyVaccine)))
    : [];

    return (
      <div>
        {
          profileTherapyVaccine.map((groupVaccine, index) => {
            return (
              <CustomCard key ={index}>
                <div className={styles.chronicConditionsWrapper}>
                  <div className="cardHeaderProfile">
                  { groupVaccine[0].category }
                  </div>
                  <div className="containerTags">
                    <Form.Item>
                      <CustomTag
                        handleClick={this.onClickTag}
                        tags={ groupVaccine }
                        keyTag='profileTherapyVaccine'
                      />
                    </Form.Item>
                  </div>
                </div>
              </CustomCard>
            );
          })
        }
      </div>
    );
  }
}

export default injectIntl(ProfileTherapyAndVaccines);
