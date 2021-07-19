import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Icon, Button } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from './styles.module.less';
import CustomCard from '../Common/CustomCard.js';

export default injectIntl(
  class EncyclopediaMedicineSearchResults extends Component {
    displayName = EncyclopediaMedicineSearchResults.name;
    static propTypes = {
      renderSearchBar: PropTypes.array
    };
    static defaultProps = {
      renderSearchBar: []
    };
    constructor (props) {
      super(props);
      this.state = {
        current: 1,
        disableShowMore: false,
        isMobile: window.innerWidth < 768
      };
    }
    handleShowMore = () => {
      const current = this.state.current + 1;
      const quantityPages = Math.ceil(this.props.renderSearchBar.length / 5);

      this.setState({ current, disableShowMore: quantityPages <= current });
    };

    render () {
      const { renderSearchBar, deleteLatestSearch, handleDelete, intl: { formatMessage, locale }} = this.props;
      const { current, disableShowMore, isMobile } = this.state;
      const showedItems = [...renderSearchBar].sort((a, b) => b.date - a.date).slice(0, current * 5);

      return (
        showedItems.length !== 0 && (
          <CustomCard>
            <div className={styles.cardHeaderBlock}>
              <div className={styles.cardHeader}>
                {renderSearchBar.length !== 0 ? (
                  <FormattedMessage id="EncyclopediaMedicineSearchResults.previousSearches" />
                ) : (
                  <FormattedMessage id="EncyclopediaMedicineSearchResults.search" />
                )}
              </div>
              {renderSearchBar.length !== 0 && (
                <Button
                  type="primary"
                  className={styles.deleteBtn}
                  onClick={e => handleDelete(e, deleteLatestSearch, '', false)}
                >
                  {
                    !isMobile
                    ? (
                      <FormattedMessage id="EncyclopediaMedicineSearchResults.deleteAll" />
                    ) : (
                      <FormattedMessage id="EncyclopediaMedicineSearchResults.deleteAllMobile" />
                    )
                  }
                </Button>
              )}
            </div>
            <React.Fragment>
              {showedItems.map((item, i) => {
                return (
                  <Link
                    key={`metric-${item.title}-${i}`}
                    onClick={() => {
                      item.title = item.searchText;
                      this.props.setActiveItem(item);
                    }}
                    to={`/encyclopediaMedicine/${item.linkedEntityId}?lang=${locale}`}
                  >
                    <div className={styles.availableItem}>
                      <div className={styles.leftSideAvailable}>
                        <div>{item.searchText}</div>
                      </div>
                      {renderSearchBar.length !== 0 && (
                        <Button
                          onClick={e =>
                            handleDelete(e, deleteLatestSearch, item.id, true)
                          }
                          type="primary"
                          className={styles.addBtn}
                        >
                          <Icon className={styles.iconClose} type="close" />
                        </Button>
                      )}
                    </div>
                  </Link>
                );
              })}
              <div className={styles.showMore}>
                {renderSearchBar.length > 5 && (
                  <p
                  disabled={disableShowMore}
                  onClick={this.handleShowMore}
                  >
                  {disableShowMore ? '' : formatMessage({ id: 'EncyclopediaMedicineSearchResults.showMore' }) }
                  </p>
                )}
              </div>
            </React.Fragment>
          </CustomCard>
        )
      );
    }
  }
);
