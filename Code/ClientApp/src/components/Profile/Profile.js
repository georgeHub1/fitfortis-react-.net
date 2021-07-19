import React, { Component } from 'react';
import { Button, Tabs, message } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import ReactLoading from 'react-loading';
import ProfileAccount from './ProfileAccount';
import ProfileBasicInformation from './ProfileBasicInformation';
import ProfileFamilyHistory from './ProfileFamilyHistory';
import ProfileTherapyAndVaccines from './ProfileTherapyAndVaccines';
import ProfileChronicConditions from './ProfileChronicConditions';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  updateProfile,
  setProfileBasicInformation,
  setProfileLifeStyle,
  setProfileAvatar,
  setProfileChronicConditions,
  setProfileFamilyHistory,
  setProfileTherapyVaccine,
  setProfileStoreState
} from '../../redux/profile.action';
import { localeSet } from '../../redux/locale.action';
import {
  setUserInfo
} from '../../redux/symptomChecker.action';
import profileAPI from '../../backendServices/profile.js';
import {
  accountForm,
  profileBasicInformationForm,
  familyHistoryForm,
  conditionsForm,
  TherapyAndVaccinesFrom,
  profileUpdateGroupSections,
  profileDispatchGroupSections,
  profileFetchGroupSections,
  profileCompareData,
  showDifference,
  re
} from '../../constants/profile';
import CustomCard from '../Common/CustomCard.js';
import styles from './styles.module.less';
import { getAgeRange } from '../../constants/symptomChecker';
import { clearNewsFeedList } from '../../redux/adminTool.action';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';

class Profile extends Component {
  displayName = Profile.name;
  static propTypes = {
    account: PropTypes.object,
    basicInformation: PropTypes.object,
    familyHistory: PropTypes.object,
    conditions: PropTypes.object,
    changes: PropTypes.object
  };
  static defaultProps = {
    account: {},
    basicInformation: {},
    conditions: {},
    changes: {},
    familyHistory:{},
    therapyAndVaccines: {}
  };
  constructor (props) {
    super(props);
    this.state = {
      activeTab: accountForm,
      account: {...props.account},
      profileBasicInformation: props.profileBasicInformation,
      profileLifeStyle: props.profileLifeStyle,
      profileFamilyHistory: props.profileFamilyHistory,
      profileChronicConditions: props.profileChronicConditions,
      profileTherapyVaccine: props.profileTherapyVaccine,
      changes: props.changes,
      avatar: props.avatar,
      updateAvatar: false,
      isDisabled: true,
      isLoading: false,
      languageCode: this.props.language
    };
  }

  isObject = obj => obj != null && obj.constructor.name === 'Object';

  setTabValue = value => {
    let changeLanguage = false;

    this.setState(value, this.validateInformation);
    if (Object.keys(value)[0] === 'avatar') {
      this.props[profileDispatchGroupSections.avatar]({avatar: value.avatar})
      .then(() => {
        this.setState({...this.state, updateAvatar: true}, this.validateInformation);
      });
    }

    if (Object.keys(value)[0] === 'account') {
      changeLanguage = value.account.language !== this.state.account.language;
    }

    if (!changeLanguage) {
      this.setState(value, this.validateInformation);
    }

    if (changeLanguage) {
      const newLanguage = value.account.language;
      const startLanguage = this.props.account.language;
      const { userId } = this.state.account;
      const sections = ['profileBasicInformation', 'profileLifeStyle', 'profileChronicConditions', 'profileFamilyHistory', 'profileTherapyVaccine'];

      sections.forEach(section => {
        if (newLanguage !== startLanguage) {
          profileAPI[profileFetchGroupSections[section]](userId, newLanguage).then(res => {
            this.setState({
              [section]: [...profileCompareData(res, this.state[section])]
            }, this.validateInformation);
          });
        } else {
          const newData = profileCompareData(R.clone(this.props[section]), R.clone(this.state[section]));

          this.setState({
            [section]: [...newData]
          }, this.validateInformation);
        }
      });
    }
  }


  onChangeTabInfo = (tab, key, value) => {
    this.setState(
      {
        [tab]: {
          ...this.state[tab],
          [key]: value
        }
      },
      () => this.validateInformation()
    );
  };

  validateFields = (key, value) => {
    if (key === 'firstName') return !value.length;
    if (key === 'lastName') return !value.length;
    if (key === 'email') return !re.test(value);
    return false;
  };


  componentWillUnmount () {
    const {state} = this;
    const {onUpdateProfileStoreState} = this.props;

    if (!state.isDisabled) {
      onUpdateProfileStoreState({...state});
    }
  }

  componentDidMount () {
    if (window.location.search.includes('?lang=')) {
      const lan = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');

      this.props.onUpdateLanguage(lan);
      localStorage.setItem('language', lan);
    }
    analyticId.firebaseAnalyticsLog('Profile');
    const {profileStoreState, onUpdateProfileStoreState, intl: { locale } } = this.props;

    if (locale !== this.state.account.language) {
      const value = {
        account: {
          ...this.props.account,
          language: locale
        }
      };

      this.setTabValue(value);
    }
    if (!R.isEmpty(profileStoreState)) {
      this.setState({
        ...profileStoreState
      });
      onUpdateProfileStoreState({});
    }
  }

  componentDidUpdate ({ account, profileBasicInformation, profileLifeStyle, profileChronicConditions,
    profileFamilyHistory, profileTherapyVaccine, languageCode, avatar, profileStoreState }) {
    const { account: accountProps,
      profileBasicInformation: profileBasicInformationProps,
      languageCode: languageCodeProps,
      profileLifeStyle: profileLifeStyleProps,
      profileChronicConditions: profileChronicConditionsProps,
      profileFamilyHistory: profileFamilyHistoryProps,
      profileTherapyVaccine: profileTherapyVaccineProps,
      avatar: avatarProps,
      intl: { locale }
      } = this.props;

    if (locale !== this.state.account.language) {
      const value = {
        account: {
          ...this.props.account,
          language: locale
        }
      };

      this.setTabValue(value);
    }
    if (!R.equals(avatar, avatarProps))
      this.setState({ avatar: avatarProps });

    if (!R.equals(account, accountProps))
      this.setState({ account: accountProps });


    if (!R.equals(profileBasicInformation, profileBasicInformationProps))
      this.setState({
        profileBasicInformation: profileBasicInformationProps
      });
    if (!R.equals(profileLifeStyle, profileLifeStyleProps))
      this.setState({
        profileLifeStyle: profileLifeStyleProps
    });

    if (!R.equals(profileChronicConditions, profileChronicConditionsProps))
      this.setState({
        profileChronicConditions: profileChronicConditionsProps
      });


    if (!R.equals(profileFamilyHistory, profileFamilyHistoryProps))
      this.setState({
        profileFamilyHistory: profileFamilyHistoryProps
      });

    if (!R.equals(profileTherapyVaccine, profileTherapyVaccineProps))
      this.setState({
        profileTherapyVaccine: profileTherapyVaccineProps
    });

    if (!R.equals(languageCode, languageCodeProps)) {
      this.setState({
        languageCode: languageCodeProps
      });
    }
  }

  onChangeTab = activeTab => {
    this.setState({ activeTab });
  };


  validateInformation = () => {
    const props = R.clone(this.props);
    const state = R.clone(this.state);
    const disableSet = [];
    const validateArr = [];

    let cloneAccount = R.clone(state.account);

    if (!cloneAccount.password)
      cloneAccount = { ...cloneAccount, password: '' };
    if (!cloneAccount.confirm) cloneAccount = { ...cloneAccount, confirm: '' };

    Object.keys(cloneAccount).forEach(key =>
      validateArr.push(this.validateFields(key, cloneAccount[key]))
      );

    if (validateArr.some(bool => bool))
      return this.setState({ isDisabled: true });

      delete state.account.password;
      delete state.account.confirm;


    Object.keys(profileUpdateGroupSections).forEach(key => {
      const diff = key === 'avatar'
        ? !this.state.updateAvatar
        : showDifference(props[key], state[key]).length === 0;

      disableSet.push(diff);
    });

    this.setState({ isDisabled: !disableSet.some(bool => !bool) });
  };

  handleSaveProfile = () => {
    analyticId.firebaseAnalyticsLog('Profile_ClickSave');
    this.updateProfile();
    this.validateInformation();
  };

  getSelectedBasicLifeStyle = section => {
    let ItemSelectedId = {};
    const pattern = elm => elm.isSelected === true;

    this.state[section].forEach(item => {
      ItemSelectedId = R.assoc(
        item.key,
        R.filter(pattern)(item.values).length > 0
        ? R.filter(pattern)(item.values)[0].id
        : undefined
      )(ItemSelectedId);
    });

    return ItemSelectedId;
  }
  implementRequestUpdateProfile = ({
    changesArr, apiRequestUpdate, apiRequestDelete, profileSection
  }) => {
    const arrUpdate = [];
    const arrDelete = [];
    const arrContainerProfileUpdates = [];

    if (profileSection === 'avatar') {
      const { avatar } = this.state;

      return profileAPI[profileUpdateGroupSections[profileSection].update]({
        userId: this.props.account.userId,
        avatar
      });
    }

    if (profileSection === 'account') {
      const {account} = this.state;

      return profileAPI[profileUpdateGroupSections[profileSection].update]({
        userId: account.userId,
        data: { ...account }
      });
    }

    if (['profileBasicInformation', 'profileLifeStyle'].includes(profileSection)) {
          const ItemSelectedId = this.getSelectedBasicLifeStyle(profileSection);

          return profileAPI[profileUpdateGroupSections[profileSection].update]({
            userId: this.props.account.userId,
            data: { data: ItemSelectedId }
          });
    }

    if (['profileFamilyHistory', 'profileChronicConditions', 'profileTherapyVaccine'].includes(profileSection)) {
      changesArr.forEach(item => {
        if (item.newValue.isSelected)
          arrUpdate.push(item.newValue.id);
        else
          arrDelete.push(item.newValue.id);
      });

      if (arrDelete.length) {
        const requestDeleteProfile = profileAPI[apiRequestDelete]({
          data: { 'keys': arrDelete },
          userId: this.props.account.userId
        });

        arrContainerProfileUpdates.push(requestDeleteProfile);
      }
      if (arrUpdate.length) {
        const requestUpdateProfile = profileAPI[apiRequestUpdate]({
          data: { 'keys': arrUpdate },
          userId: this.props.account.userId
        });

        arrContainerProfileUpdates.push(requestUpdateProfile);
      }

      return Promise.all(arrContainerProfileUpdates);
    }
  }

  fetchSynchronous = async arrayApi => {
    const results = [];

    for (const item of arrayApi) {
      const r = await this.implementRequestUpdateProfile(item);

      results.push(r);
    }
    return results;
  }

  updateProfile = async () => {
    const state = R.clone(this.state);
    const arrContainerProfileSections = [];
    const keysOfGroupSection = Object.keys(profileUpdateGroupSections);

    keysOfGroupSection.forEach(key => {
      const dataByKey = R.clone(this.props[key]);
      const data = R.clone(state[key]);
      const changesArr = showDifference(data, dataByKey, key);

      const updateProfile = key === 'avatar'
        ? this.state.updateAvatar
        : changesArr.length > 0;

      if (updateProfile) {
        arrContainerProfileSections.push({
          changesArr,
          apiRequestUpdate: profileUpdateGroupSections[key].update,
          apiRequestDelete: profileUpdateGroupSections[key].delete,
          profileSection: key
        });
      }
    });

    this.setState({isLoading: true});

    try {
      this.fetchSynchronous(arrContainerProfileSections)
      .then(result => {
        localStorage.language = this.state.account.language;
        localStorage.changeLanguages = JSON.stringify([this.state.account.language]);
        const { account } = this.state;

        this.setState({updateAvatar: false});

        keysOfGroupSection.forEach(profileSection => {
          const parramDispath = profileSection === 'account'
            ? {account: {...this.state[profileSection]}}
            : this.state[profileSection];

          if (profileSection === 'avatar') {
            this.props[profileDispatchGroupSections.avatar]({avatar: this.state.avatar});
          }
          else {
            this.props[profileDispatchGroupSections[profileSection]](parramDispath);
          }
        });
        const findSexAtBirth = this.state.profileBasicInformation.find(x => x.key === 'Sexatbirth');

        let selectedSexAtBirth;

        if (findSexAtBirth) {
          selectedSexAtBirth = findSexAtBirth.values.find(x => x.isSelected);
        }

        let selectedSexAtBirthValue;

        if (selectedSexAtBirth) {
          if (selectedSexAtBirth.id === 1) {
            selectedSexAtBirthValue = 'male';
          } else if (selectedSexAtBirth.id === 2) {
            selectedSexAtBirthValue = 'female';
          } else {
            selectedSexAtBirthValue = 'intersex';
          }
        }

        this.props.setUserInfo({
          ...this.props.symptomChecker.userInfo,
          keyYear: account.dateOfBirth ? getAgeRange(account.dateOfBirth) : {},
          gender: selectedSexAtBirth ? selectedSexAtBirthValue : this.props.symptomChecker.userInfo.gender
        });

        this.showMessageSuccess();
      });
    } catch (error) {
      message.error('Error');
      this.validateInformation();
    }
  }

  showMessageSuccess = () => {
    this.props.clearNewsFeedList();
    message.success('Successfully saved!');
      this.setState({ isLoading: false }, () =>
      this.validateInformation()
    );
  }

  render () {
    const {
      intl: { formatMessage },
      history,
      changes
    } = this.props;

    const {
      activeTab,
      account,
      profileBasicInformation,
      profileLifeStyle,
      profileChronicConditions,
      profileTherapyVaccine,
      isDisabled,
      isLoading,
      profileFamilyHistory,
      avatar
    } = this.state;

    const category = profileBasicInformation !== undefined
      ? R.filter(cat => cat.key === 'Sexatbirth')(profileBasicInformation)[0]
      : undefined;
    const filterSelectedGenderIdentity = category !== undefined
    ? R.filter(elm => elm.isSelected === true)(category.values)
    : [{id: undefined}];
    const genderIdentity = filterSelectedGenderIdentity.length > 0
      ? filterSelectedGenderIdentity[0].id
      : undefined;

    return (
      <div className="profilePage">
      { isLoading ? (
          <div className={styles.spinnerContainer}>
            <ReactLoading type="spin" color="#fff" />
          </div>
        ) : null
      }
        <h1 className={ styles.header }>
          <FormattedMessage id="Profile.header" />
        </h1>
        <section>
          <Tabs
            onChange={ this.onChangeTab }
            type="card"
            activeKey={ activeTab }
            tabBarStyle={{ borderBottom: 'none', overflow: 'hidden' }}
          >
            <Tabs.TabPane
              className="ProfileSettings"
              tab={formatMessage({
                id: 'Profile.account'
              })}
              key={ accountForm }
            >
              <CustomCard
                style={{ borderTopWidth: 0, borderTopRightRadius: 0 }}
              >
                <ProfileAccount
                  setTabValue={ this.setTabValue }
                  history = { history }
                  account={ account }
                  avatar={ avatar }
                  changes={changes}
                />
              </CustomCard>
            </Tabs.TabPane>

            <Tabs.TabPane
              className="ProfileBasicInformation"
              tab={formatMessage({
                id: 'Profile.basicInformation'
              })}
              key={ profileBasicInformationForm }
            >
              <CustomCard>
                <ProfileBasicInformation
                  profileBasicInformation={ profileBasicInformation }
                  profileLifeStyle={profileLifeStyle}
                  setTabValue={ this.setTabValue }
                  account={ account }
                />
              </CustomCard>
            </Tabs.TabPane>

            <Tabs.TabPane
              className="ProfileChronicConditions"
              tab={formatMessage({
                id: 'Profile.chronicConditions'
              })}
              key={ conditionsForm }
            >
              <CustomCard
                style={{
                  borderTopWidth: 0,
                  borderTopRightRadius: 0
                }}
              >
                <ProfileChronicConditions
                  profileChronicConditions={ profileChronicConditions }
                  setTabValue={ this.setTabValue }
                  genderIdentity={genderIdentity}
                />
              </CustomCard>
            </Tabs.TabPane>
            <Tabs.TabPane
              className="ProfileFamilyHistory"
              tab={formatMessage({
                id: 'Profile.familyHistory'
              })}
              key={ familyHistoryForm }
            >
              <CustomCard
                style={{ borderTopWidth: 0, borderTopRightRadius: 0 }}
              >
                <ProfileFamilyHistory
                  profileFamilyHistory={ profileFamilyHistory }
                  setTabValue={ this.setTabValue }
                />
              </CustomCard>
            </Tabs.TabPane>
            <Tabs.TabPane
              className="ProfileTherapyAndVaccines"
              tab={formatMessage({
                id: 'Profile.therapyAndVaccines'
              })}
              key={ TherapyAndVaccinesFrom }
            >
              <CustomCard
                style={{ borderTopWidth: 0, borderTopRightRadius: 0 }}
              >
                <ProfileTherapyAndVaccines
                  setTabValue={this.setTabValue}
                  profileTherapyVaccine = { profileTherapyVaccine }
                />
              </CustomCard>
            </Tabs.TabPane>
          </Tabs>
          <div className={ styles[`bottomPanel__${activeTab}`]} style={{ height: 73, paddingRight: 0 } }>
            <Button
              disabled={isDisabled}
              onClick={this.handleSaveProfile}
              type="primary"
              htmlType="submit"
              style={{ float: 'right', marginTop: 30 }}
            >
              <FormattedMessage id="Profile.saveBtn" />
            </Button>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = ({ profile, symptomChecker }) => {
  const {
    account,
    profileBasicInformation,
    profileLifeStyle,
    profileChronicConditions,
    profileFamilyHistory,
    therapyAndVaccines,
    profileTherapyVaccine,
    changes,
    avatar,
    profileStoreState
  } = profile;


  return {
    account,
    profileBasicInformation,
    profileLifeStyle,
    profileChronicConditions,
    profileFamilyHistory,
    therapyAndVaccines,
    profileTherapyVaccine,
    changes,
    avatar,
    profileStoreState,
    symptomChecker
  };
};

const mapDispatchToProps = dispatch => ({
  onUpdateProfileAvatar (args) {
    dispatch(setProfileAvatar(args));
    return Promise.resolve();
  },
  onUpdateProfile (args) {
    dispatch(updateProfile(args));
    return Promise.resolve();
  },
  onUpdateProfileBasicInformation (...args) {
    dispatch(setProfileBasicInformation(...args));
    return Promise.resolve();
  },
  onUpdateProfileLifeStyle (...args) {
    dispatch(setProfileLifeStyle(...args));
    return Promise.resolve();
  },
  onUpdateProfileChronicConditions (...args) {
    dispatch(setProfileChronicConditions(...args));
    return Promise.resolve();
  },
  onUpdateProfileFamilyHistory (...args) {
    dispatch(setProfileFamilyHistory(...args));
    return Promise.resolve();
  },
  onUpdateProfileTherapyVaccine (...args) {
    dispatch(setProfileTherapyVaccine(...args));
    return Promise.resolve();
  },
  onUpdateProfileStoreState (...args) {
    dispatch(setProfileStoreState(...args));
    return Promise.resolve();
  },
  onUpdateLanguage (args) {
    dispatch(localeSet(args));
    return Promise.resolve();
  },
  setUserInfo (...args) {
    return dispatch(setUserInfo(...args));
  },
  clearNewsFeedList (...args) {
    return dispatch(clearNewsFeedList(...args));
  }
});

export default injectIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Profile)
);
