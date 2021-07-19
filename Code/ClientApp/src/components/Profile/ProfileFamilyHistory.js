import React, { Component } from 'react';
import { Form } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import CustomCard from '../Common/CustomCard.js';
import CustomTag from '../Common/CustomTag';
import styles from './styles.module.less';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';

class ProfileFamilyHistory extends Component {
  displayName = ProfileFamilyHistory.name;

  static propTypes = {
    profileFamilyHistory: PropTypes.array
  };

  static defaultProps = {
    profileFamilyHistory: []
  };

  constructor (props) {
    super(props);
    this.state = {
      profileFamilyHistory: props.profileFamilyHistory
    };
  }

  componentDidMount () {
    analyticId.firebaseAnalyticsLog('Profile_FamilyHistory');
  }
  componentDidUpdate ({profileFamilyHistory}) {
    const { profileFamilyHistory: profileFamilyHistoryProps } = this.props;

    if (!R.equals(profileFamilyHistory, profileFamilyHistoryProps))
      this.setState({
        profileFamilyHistory: [...profileFamilyHistoryProps]
      });
  }


  onClickTag = (tag, key) => {
    const { setTabValue } = this.props;
    const { profileFamilyHistory } = this.state;

    const data = R.clone(profileFamilyHistory);
    const indexElem = R.indexOf(tag)(data);
    const newElem = R.assoc('isSelected', !tag.isSelected)(tag);

    data.splice(indexElem, 1, newElem);
    setTabValue({
      profileFamilyHistory: [
        ...data
      ]
    });
    this.setState({
      profileFamilyHistory: [
        ...data
      ]
    });
  };

  render () {
      const profileFamilyHistory = this.state.profileFamilyHistory !== undefined
      ? R.groupWith((a, b) => a.key === b.key, R.sortBy(R.prop('key'), R.clone(this.state.profileFamilyHistory)))
      : [];

    return (
      <div>
        {
          profileFamilyHistory.map((groupFamilyHistory, index) => {
            return (<CustomCard key ={index}>
              <div className={styles.historyfamilyWrapper}>
                <div className="cardHeaderProfile">
                  { groupFamilyHistory[0].category }
                </div>
                <div className="containerTags">
                  <Form.Item>
                    <CustomTag
                      handleClick={this.onClickTag}
                      tags={ groupFamilyHistory }
                      keyTag='profileFamilyHistory'
                    />
                  </Form.Item>
                </div>
              </div>
            </CustomCard>);
          })
        }
      </div>
    );
  }
}

const WrappedProfileFamilyHistory = Form.create({
  name: 'profileFamilyHistory'
})(ProfileFamilyHistory);

export default injectIntl(WrappedProfileFamilyHistory);
