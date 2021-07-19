import React, { Component } from 'react';
import CustomCard from '../Common/CustomCard.js';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import styles from './styles.module.less';

export default injectIntl(
  class SymptomCheckerSearchResults extends Component {
    displayName = SymptomCheckerSearchResults.name;
    static propTypes = {
      tags: PropTypes.array
    };
    static defaultProps = {
      tags: []
    };
    render () {
      const {
        tags,
        causesAndDiagnosis,
        handleCloseModal,
        getBgColor
      } = this.props;

      return (
        <div className={styles.wrapCustomCard}>
          <CustomCard>
            <div className={styles.cardHeaderBlock}>
              <div className={styles.cardHeader}>
                <FormattedMessage id="SymptomCheckerSearchResults.causesAndDiagnoses" />
              </div>
            </div>
            <div className={styles.possibleCauses}>
              {tags.length > 0 ? (
                causesAndDiagnosis
                  .sort((a, b) => b.percent - a.percent)
                  .map(item => (
                    item.percent > 0 ? <div
                      key={item.name}
                      onClick={e => handleCloseModal(e, item)}
                      className={styles.itemCause}
                    >
                      <div
                        className={styles.percentBlock}
                        style={{ background: getBgColor(item.percent) }}
                      >
                        {item.percent}%
                      </div>
                      <div className={styles.nameCause}>{item.name}</div>
                    </div>
                    : null
                  ))
              ) : (
                <p className={styles.paragraphInfo}>
                  <FormattedMessage id="SymptomCheckerSearchResults.causesAndDiagnosesInfo" />
                </p>
              )}
            </div>
          </CustomCard>
        </div>
      );
    }
  }
);
