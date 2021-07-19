import React, { Component } from 'react';
import { Input, Icon, AutoComplete } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
import styles from './styles.module.less';
import EncyclopediaMedicineSearchResults from './EncyclopediaMedicineSearchResults';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';
const Option = AutoComplete.Option;

let autoCompleteRef = React.createRef();

export default injectIntl(
  class EncyclopediaMedicineSearch extends Component {
    displayName = EncyclopediaMedicineSearch.name;
    static propTypes = {
      medicineList: PropTypes.array,
      latestMedicineSearch: PropTypes.array
    };
    static defaultProps = {
      medicineList: [],
      latestMedicineSearch: []
    };
    constructor (props) {
      super(props);

      this.state = {
        valueAutoCmplt: '',
        searchItems: [],
        dataSource: [],
        isSearchAgain: false,
        isOpen: false,
        showAllResult: false
      };
    }

    componentWillMount () {
      analyticId.firebaseAnalyticsLog('Encyclopedia_DrugsMeds', {});
      if (!this.isOpenInMobile) {
        window.addEventListener('resize', this.resizeEventListener);
      }
    }

    componentWillUnmount () {
      if (!this.isOpenInMobile) {
        window.removeEventListener('resize', this.resizeEventListener);
      }
    }

    isOpenInMobile = () => {
      return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    }

    resizeEventListener = () => {
      const { isOpen } = this.state;

      if (isOpen) {
        this.setState({
          ...this.state,
          isOpen: false
        });
        autoCompleteRef.blur();
      }
    };

    handleChange = (e, isFocus) => {
      if (e !== 'SHOW_ALL_ITEMS') {
        if (!this.props.isSearchItemMedicineLoaded && !this.props.isSearchItemMedicineLoading) {
          this.props.fetchEncyclopediaMedicine();
        }
        let flag = false;

        if (e) {
          flag = true;
        }
        this.setState({ ...this.state, showAllResult: false, valueAutoCmplt: e, isOpen: flag, searchItems: e !== '' ? this.props.searchList : [] });

        const result = this.props.medicineList.filter(item => {
          return item.title.toLowerCase().includes(e !== undefined ? e.toLowerCase() : '');
        });

        if (result.length === 0 && this.props.medicineList.length !== 0 && e !== undefined && !isFocus) {
          this.props.addMedicineNewSearch('', '', e, false);
        }
      }
    };
    handleSelect = (e, opt, renderItems) => {
      if (e === 'SHOW_ALL_ITEMS') {
        this.setState({ ...this.state, showAllResult: true });
      } else {
        const item = renderItems.find(x => x.uniqueId === e);

        if (item) {
          this.props.addMedicineNewSearch(item.id, item.uniqueId, item.title, true);
        }
        this.setState({ ...this.state, valueAutoCmplt: e, searchItems: [] });
      }
    };

    handleDelete = (e, deleteMedicineLatestSearch, id, oneItem) => {
      e.preventDefault();
      deleteMedicineLatestSearch(id, oneItem);
    };
    getHighlightedText = (higlight, text) => {
      const parts = text.split(new RegExp(`(${higlight})`, 'gi'));

      return (
        <span key={text}>
          {parts.map((part, i) => {
            if (higlight) {
              return (
                <span
                  key={i}
                  style={
                    part.toLowerCase().indexOf(higlight.toLowerCase()) !== -1
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
      return data.filter(item => {
        return item.title.toLowerCase().includes(text.toLowerCase());
      });
    }

    render () {
      let children = [];

      const {
        intl: { formatMessage, locale },
        deleteMedicineLatestSearch,
        latestMedicineSearch,
        medicineList,
        setActiveItem
      } = this.props;

      const { valueAutoCmplt = '', isOpen, showAllResult } = this.state;

      const filteredResult = (valueAutoCmplt !== '') ? this.filter(medicineList, valueAutoCmplt) : [];

      const renderCount = 20;

      const renderItems = (showAllResult) ? filteredResult : filteredResult.splice(0, renderCount);

      children = renderItems.map((item, i) => (
        <Option
          onClick={() => {
            this.props.history.push(`/encyclopediaMedicine/${item.id}?lang=${locale}`);
            this.props.setActiveItem(item);
          }}
          key={item.uniqueId}
        >
          {this.getHighlightedText(valueAutoCmplt, item.title)}
        </Option>
      ));
      if (!showAllResult && renderItems.length === renderCount) {
        children = children.concat(
          <Option
            className={styles.showMoreResult}
            key={'SHOW_ALL_ITEMS'}
          >
            {formatMessage({ id: 'EncyclopediaMedicineSearch.showAllItems' })}
          </Option>
        );
      }

      return (
        <section className={styles.containerEncyclopedia}>
          <div className={styles.searchInputBlock}>
            <AutoComplete
              ref={e => autoCompleteRef = e}
              defaultActiveFirstOption={false}
              className={styles.searchInput}
              dataSource={children}
              value={valueAutoCmplt}
              open={isOpen}
              dropdownMatchSelectWidth={false}
              dropdownClassName="autocompleteEncyclopedia"
              onChange={e => this.handleChange(e, false)}
              onBlur={() => {
                if (!this.isOpenInMobile()) {
                  this.setState({
                    ...this.state,
                    isOpen: false
                  });
                }
              }}
              onFocus={e => {
                if (valueAutoCmplt && !this.isOpenInMobile()) {
                  this.handleChange(valueAutoCmplt, true);
                } else {
                  this.handleChange(e, true);
                }
              }}
              onSelect={(e, opt) => {
                this.handleSelect(e, opt, renderItems);
              }}
            >
              <Input
                className={styles.searchInput}
                placeholder={formatMessage({
                  id: 'EncyclopediaMedicineSearch.placeholder'
                })}
                prefix={
                  <Icon type="search" className={styles.certainCategoryIcon} />
                }
              />
            </AutoComplete>
          </div>
          <EncyclopediaMedicineSearchResults
            valueAutoCmplt={valueAutoCmplt}
            deleteLatestSearch={deleteMedicineLatestSearch}
            handleDelete={this.handleDelete}
            renderSearchBar={latestMedicineSearch}
            setActiveItem={setActiveItem}
          />
          <div>
              {
                ((this.props.isSearchItemMedicineLoading) && (valueAutoCmplt !== '' && valueAutoCmplt !== undefined)) ? (
                  <div className={styles.center}>
                    <ReactLoading className={styles.center} height={'30px'} width={'30px'} type="spin" color="#335889" />
                    <span>Loading...</span>
                  </div>
                ) : ('')
              }
            </div>
        </section>
      );
    }
  }
);
