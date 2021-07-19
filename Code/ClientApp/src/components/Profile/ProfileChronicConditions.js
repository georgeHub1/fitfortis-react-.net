import React, { Component } from 'react';
import { Form } from 'antd';
import { injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import CustomTag from '../Common/CustomTag';
import CustomCard from '../Common/CustomCard.js';
import styles from './styles.module.less';
import * as R from 'ramda';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';

class ProfileChronicConditions extends Component {
  static propTypes = {
    setTabValue: PropTypes.func,
    profileChronicConditions: PropTypes.array
  };
  static defaultProps = {
    profileChronicConditions: [],
    setTabValue: () => true
  };
  constructor (props) {
    super(props);
    this.state = {
      profileChronicConditions: props.profileChronicConditions
    };
  }

  componentDidMount () {
    analyticId.firebaseAnalyticsLog('Profile_ChronicConditions');
  }
  componentDidUpdate ({profileChronicConditions}) {
    const { profileChronicConditions: profileChronicConditionsProps} = this.props;

    if (!R.equals(profileChronicConditions, profileChronicConditionsProps))
    this.setState({
      profileChronicConditions: [...profileChronicConditionsProps]
    });
  }

  onClickTag = (tag, key) => {
    const { setTabValue } = this.props;
    const { profileChronicConditions } = this.state;

    const data = R.clone(profileChronicConditions);
    const indexElem = R.indexOf(tag)(data);
    const newElem = R.assoc('isSelected', !tag.isSelected)(tag);

    data.splice(indexElem, 1, newElem);
    setTabValue({
      profileChronicConditions: [
        ...data
      ]
    });
    this.setState({
      profileChronicConditions: [
        ...data
      ]
    });
  };

  render () {
    const profileChronicConditions = this.state.profileChronicConditions !== undefined
      ? R.groupWith((a, b) => a.key === b.key, R.sortBy(R.prop('key'), R.clone(this.state.profileChronicConditions)))
      : [];
    const {genderIdentity} = this.props;

    return (
      <div>
      {
        profileChronicConditions.map((groupChronicCondition, index) => {
          return (
            (genderIdentity === 1 && groupChronicCondition[0].key === 'Gynecologic')
            ? null
            : <CustomCard key ={index}>
                <div className={styles.chronicConditionsWrapper}>
                  <div className="cardHeaderProfile">
                  { groupChronicCondition[0].category }
                  </div>
                  <div className="containerTags">
                    <Form.Item>
                      <CustomTag
                        handleClick={this.onClickTag}
                        tags={ groupChronicCondition }
                        keyTag='profileChronicConditions'
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

export default injectIntl(ProfileChronicConditions);
