import React, { Component } from 'react';
import { Icon, Button, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import ReactLoading from 'react-loading';
import styles from './styles.module.less';

import { ReactComponent as checkMark } from '../../img/greenCheckMark.svg';
import { ReactComponent as cancel } from '../../img/redX.svg';
import { ReactComponent as questionMark } from '../../img/blueQuestionMark.svg';
import { getShortDescription } from '../../utils/stringTools';
class SymptomCheckerSideBar extends Component {
  displayName = SymptomCheckerSideBar.name;

  static propTypes = {
    selectedCause: PropTypes.object,
    allSymptoms: PropTypes.array,
    tags: PropTypes.array,
    uniqSymptoms: PropTypes.array
  };
  static defaultProps = {
    selectedCause: {
      percent: 0,
      category: '',
      name: '',
      shortDescription: '',
      symptoms: []
    },
    allSymptoms: [],
    tags: [],
    uniqSymptoms: []
  };
  state = {
    description: ''
  };
  getOwnPropety = (key, isTitle) => {
    if (key === 'matchedSymptoms')
      return isTitle ? 'Matched symptom' : checkMark;
    if (key === 'unExpected') return isTitle ? 'Unexpected symptom' : cancel;
    if (key === 'misMatch') return isTitle ? 'Missing symptom' : questionMark;
  };

  componentDidUpdate ({ isSymptomDetailsLoaded }) {
    if (this.props.isSymptomDetailsLoaded === true && isSymptomDetailsLoaded === false) {
      this.setState({
        description: getShortDescription(this.props.symptomDetails.description, 200)
      });
    }
  }

  render () {
    const {
      isFemale,
      selectedCause,
      isPregnant,
      keyYear,
      handleCloseModal,
      loading,
      intl: { formatMessage, locale }
    } = this.props;
    const { description } = this.state;

    return (
      <div className={styles.cardWrapperNewMetric}>
        <div className={`${styles.infoCause} ${styles.infoCausePercent}`}>
          {selectedCause.percent}<FormattedMessage id="SymptomCheckerSideBar.textTitle" />
        </div>
        {selectedCause.symptoms ? selectedCause.symptoms.map(symptom => {
          return Object.keys(symptom).map(key => {
            return symptom[key].map((item, i) => (
              <div
                key={`${item.name}-${item.category}-${i}`}
                className={styles.causeItem}
              >
                <Tooltip
                  placement="left"
                  title={this.getOwnPropety(key, true)}
                >
                  <Icon component={this.getOwnPropety(key, false)} />
                </Tooltip>

                <div className={styles.info}>{item.name}</div>
              </div>
            ));
          });
        }) : null}
        <div className={`${styles.causeItem} ${styles.userInfoDrawer}`}>
          <Tooltip placement="left" title="General info">
            <Icon component={checkMark} />
          </Tooltip>
          <div className={styles.info}>
            {isFemale ? <FormattedMessage id="SymptomCheckerSideBar.female" /> : <FormattedMessage id="SymptomCheckerSideBar.male" />}
            {keyYear ? `, ${keyYear.name}` : ''}
            {isFemale && isPregnant ? `, ${formatMessage({
              id: 'SymptomCheckerSideBar.pregnant'
            })}` : ''}
          </div>
        </div>
        {loading
          ? (
            <div className={styles.center}>
              <ReactLoading type="spin" color="#003459" />
            </div>
          ) : <Description description={description}/>}
        <div className={styles.btnBlock}>
          <Button onClick={handleCloseModal}>
            <FormattedMessage id="SymptomCheckerSideBar.cancel" />
          </Button>
          <Link to={`/encyclopedia/${selectedCause.id}?lang=${locale}`}>
            <Button type="primary">
              <FormattedMessage id="SymptomCheckerSideBar.readMore" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}


const mapStateToProps = ({
  symptomChecker
}) => {
  const { symptomDetails, isSymptomDetailsLoaded } = symptomChecker;

  return { symptomDetails, isSymptomDetailsLoaded };
};

const mapDispatchToProps = dispatch => ({ });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(SymptomCheckerSideBar));


const Description = ({ description }) => {
  if (description) {
    return (
      <div>
        <div className={`${styles.header} ${styles.headerCause}`}>
          <FormattedMessage id="SymptomCheckerSideBar.overview" />
        </div>
        <div className={styles.infoCause}>
            {description}
        </div>
      </div>
    );
  }
  return '';
};
