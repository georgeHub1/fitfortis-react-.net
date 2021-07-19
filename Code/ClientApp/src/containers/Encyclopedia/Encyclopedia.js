import React, { Component } from 'react';
import { connect } from 'react-redux';
import EncyclopediaTermSearch from '../../components/Encyclopedia/EncyclopediaTermSearch';
import EncyclopediaTermEntry from '../../components/Encyclopedia/EncyclopediaTermEntry';
import {
  updatePrevSearch,
  deletePrevSearch,
  fetchEncyclopedia,
  saveEncyclopediaSearchItem,
  fetchSearchHistory,
  emptyEncyclopedia,
  removeEncyclopedia,
  removeAllEncyclopedia,
  updateMedicinePrevSearch,
  deleteMedicinePrevSearch,
  fetchEncyclopediaMedicine,
  saveEncyclopediaMedicineSearchItem,
  fetchMedicineSearchHistory,
  emptyEncyclopediaMedicine,
  encyclopediaTabClick,
  removeEncyclopediaMedicine,
  removeAllEncyclopediaMedicine
} from '../../redux/encyclopedia.action';
import { setActiveItem } from '../../redux/item.action';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Tabs } from 'antd';
import CustomCard from '../../components/Common/CustomCard.js';
import EncyclopediaMedicineSearch from '../../components/Encyclopedia/EncyclopediaMedicineSearch';
import styles from './styles.module.less';
import SignUpPrompt from '../../components/Common/SignUpPrompt';
import { localeSet } from '../../redux/locale.action';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';

class Encyclopedia extends Component {
  displayName = Encyclopedia.name;
  constructor (props) {
    super(props);
    this.state = {
      defaultPath: true,
      searchList: [],
      activeTab: 'Topics',
      latestSearch: this.props.prevSearches,
      account: ''
    };
  }
  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.prevSearches !== prevState.latestSearch) {
      return { latestSearch: nextProps.prevSearches };
    }
    if (nextProps.account && nextProps.account.id && !nextProps.isHistoryLoaded) {
      nextProps.fetchSearchHistory(nextProps.account.id);
    }
    if (nextProps.account && nextProps.account.id && !nextProps.isHistoryMedicineLoaded) {
      nextProps.fetchMedicineSearchHistory(nextProps.account.id);
    }
    return null;
  }
  componentDidMount () {
    if (this.props.selectedTab !== 'Topics') {
      this.setState({
        activeTab: 'DrugsAndMedicine'
      });
    }
    if (window.location.search.includes('?lang=')) {
      const lan = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');

      this.props.onUpdateLanguage(lan);
      localStorage.setItem('language', lan);
    }
    analyticId.firebaseAnalyticsLog('Encyclopedia', {});
  }

  checkPrevSearch = ({id, title}) => {
    const data = this.props.prevSearches.find(el => el.id === id && el.searchText === title);

    return data;
  }

  addNewSearch = (string, uniqueId, title, isSuccessful) => {
    const { auth } = this.props;

    if (!auth.loggenIn) return;

    const search = [...this.props.list].filter(
      el => (el.id === string && el.uniqueId === uniqueId) && !this.props.prevSearches.includes(el)
      ).map(el => {
        el.date = new Date().getTime();
        return el;
      });
    const obj = search.length > 0 ? this.checkPrevSearch(search[0]) : undefined;
    const searchId = search.length > 0 ? search[0].id : '';

    if (!obj) {
      const { id } = this.props.account;

      this.props.saveEncyclopediaSearchItem(title, searchId, id, isSuccessful);
      const newObj = {
        date: new Date(),
        id: string,
        linkedEntityId: string,
        searchArea: 1,
        searchText: title,
        userId: this.props.account.id
      };

      if (isSuccessful) {
        this.props.updatePrevSearch([newObj]);
      }
    }
  };

  checkMedicinePrevSearch = ({id, title}) => {
    const data = this.props.medicinePrevSearches.find(el => el.id === id && el.searchText === title);

    return data;
  }

  addMedicineNewSearch = (string, uniqueId, title, isSuccessful) => {
    const { auth } = this.props;

    if (!auth.loggenIn) return;

    const search = [...this.props.medicineList].filter(
      el => (el.id === string && el.uniqueId === uniqueId) && !this.props.medicinePrevSearches.includes(el)
      ).map(el => {
        el.date = new Date().getTime();
        return el;
      });
    const obj = search.length > 0 ? this.checkMedicinePrevSearch(search[0]) : undefined;
    const searchId = search.length > 0 ? search[0].id : '';

    if (!obj) {
      const { id } = this.props.account;

      this.props.saveEncyclopediaMedicineSearchItem(title, searchId, id, isSuccessful);
      const newObj = {
        date: new Date(),
        id: string,
        linkedEntityId: string,
        searchArea: 1,
        searchText: title,
        userId: this.props.account.id
      };

      if (isSuccessful) {
        this.props.updateMedicinePrevSearch([newObj]);
      }
    }
  };
  onChangeTab = activeTab => {
    this.props.encyclopediaTabClick(activeTab);
    this.setState({ activeTab });
  };
  deleteMedicineLatestSearch = (e, oneItem) => {
    let search = [...this.props.medicinePrevSearches].filter(i => i.id !== e);

    if (!oneItem) search = [];
    // Update Store
    this.props.deleteMedicinePrevSearch(search);

    if (!oneItem) {
      this.props.removeAllEncyclopediaMedicine(this.props.account.id);
    } else {
      this.props.removeEncyclopediaMedicine(e);
    }
  };
  deleteLatestSearch = (e, oneItem) => {
    let search = [...this.props.prevSearches].filter(i => i.id !== e);

    if (!oneItem) search = [];
    // Update Store
    this.props.deletePrevSearch(search);

    if (!oneItem) {
      this.props.removeAllEncyclopedia(this.props.account.id);
    } else {
      this.props.removeEncyclopedia(e);
    }
  };
  isDisable  () {
    const { auth } = this.props;

    return !auth.loggenIn;
  }

  render () {
    const {
      location,
      history,
      fetchEncyclopedia,
      emptyEncyclopedia,
      list,
      auth,
      prevSearches,
      isSearchItemLoaded,
      isSearchItemLoading,
      medicinePrevSearches,
      setActiveItem,
      medicineList,
      fetchEncyclopediaMedicine,
      emptyEncyclopediaMedicine,
      isSearchItemMedicineLoaded,
      isSearchItemMedicineLoading,
      intl: { formatMessage }
    } = this.props;

    const  { activeTab } = this.state;

    return (
      <div>
        {this.props.location.pathname === '/encyclopedia' ? (
          <div className="profilePage">
            <section className="tabsection">
              <h1 className={`${styles.header} ${styles.main_page}`}>
                <FormattedMessage id="Encyclopedia.Title" />
              </h1>
                {this.isDisable() ? <SignUpPrompt /> : ''}
              <Tabs
                onChange={ this.onChangeTab }
                type="card"
                activeKey={ activeTab }
                tabBarStyle={{ borderBottom: 'none', overflow: 'hidden' }}
              >
                <Tabs.TabPane
                  className="ProfileSettings"
                  tab={formatMessage({
                    id: 'Encyclopedia.Topics'
                  })}
                  key={ 'Topics' }
                >
                  <CustomCard
                    style={{ borderTopWidth: 0, borderTopRightRadius: 0 }}
                  >
                    <div>
                      <EncyclopediaTermSearch
                        searchList={list}
                        addNewSearch={this.addNewSearch}
                        latestSearch={prevSearches}
                        deleteLatestSearch={this.deleteLatestSearch}
                        location={location}
                        isDisable={this.isDisable()}
                        history={history}
                        auth={auth}
                        fetchEncyclopedia={fetchEncyclopedia}
                        emptyEncyclopedia={emptyEncyclopedia}
                        isSearchItemLoaded={isSearchItemLoaded}
                        isSearchItemLoading={isSearchItemLoading}
                        setActiveItem={setActiveItem}
                      />
                    </div>
                  </CustomCard>
                </Tabs.TabPane>

                <Tabs.TabPane
                  className="ProfileBasicInformation"
                  tab={formatMessage({
                    id: 'Encyclopedia.DrugsMedicines'
                  })}
                  key={ 'DrugsAndMedicine' }
                >
                  <CustomCard>
                      <div>
                        <EncyclopediaMedicineSearch
                          medicineList={medicineList}
                          addMedicineNewSearch={this.addMedicineNewSearch}
                          latestMedicineSearch={medicinePrevSearches}
                          deleteMedicineLatestSearch={this.deleteMedicineLatestSearch}
                          location={location}
                          isDisable={this.isDisable()}
                          history={history}
                          auth={auth}
                          fetchEncyclopediaMedicine={fetchEncyclopediaMedicine}
                          emptyEncyclopediaMedicine={emptyEncyclopediaMedicine}
                          isSearchItemMedicineLoaded={isSearchItemMedicineLoaded}
                          isSearchItemMedicineLoading={isSearchItemMedicineLoading}
                          setActiveItem={setActiveItem}
                        />
                      </div>
                  </CustomCard>
                </Tabs.TabPane>
              </Tabs>
            </section>
          </div>
        ) : (
          <EncyclopediaTermEntry isDisable={this.isDisable()} location={location} />
        )}
      </div>
    );
  }
}
const mapStateToProps = (({
  profile : { account },
  auth,
  encyclopedia: {
    isSearchItemLoaded,
    prevSearches,
    isLoading,
    list,
    total,
    limit,
    selectedTab,
    page,
    isSearchItemLoading,
    isHistoryLoaded,
    medicinePrevSearches,
    isSearchItemMedicineLoading,
    isMedicineLoading,
    medicineLimit,
    medicinePage,
    medicineList,
    medicineTotal,
    isHistoryMedicineLoaded,
    isSearchItemMedicineLoaded
  }
}) => ({
  auth,
  account,
  prevSearches,
  isLoading,
  list,
  total,
  limit,
  selectedTab,
  page,
  isSearchItemLoaded,
  isSearchItemLoading,
  isHistoryLoaded,
  medicinePrevSearches,
  isSearchItemMedicineLoading,
  isMedicineLoading,
  medicineLimit,
  medicinePage,
  medicineList,
  medicineTotal,
  isHistoryMedicineLoaded,
  isSearchItemMedicineLoaded
}));

const mapDispatchToProps = dispatch => ({
  updatePrevSearch (...args) {
    return dispatch(updatePrevSearch(...args));
  },
  deletePrevSearch (...args) {
    return dispatch(deletePrevSearch(...args));
  },
  removeEncyclopedia (...args) {
    return dispatch(removeEncyclopedia(...args));
  },
  removeAllEncyclopedia (...args) {
    return dispatch(removeAllEncyclopedia(...args));
  },
  fetchEncyclopedia (...args) {
    return dispatch(fetchEncyclopedia(...args));
  },
  saveEncyclopediaSearchItem (...args) {
    return dispatch(saveEncyclopediaSearchItem(...args));
  },
  fetchSearchHistory (...args) {
    return dispatch(fetchSearchHistory(...args));
  },
  encyclopediaTabClick (...arg) {
    return dispatch(encyclopediaTabClick(...arg));
  },
  emptyEncyclopedia (...args) {
    return dispatch(emptyEncyclopedia(...args));
  },
  setActiveItem (...args) {
    return dispatch(setActiveItem(...args));
  },
  fetchEncyclopediaMedicine (...args) {
    return dispatch(fetchEncyclopediaMedicine(...args));
  },
  updateMedicinePrevSearch (...args) {
    return dispatch(updateMedicinePrevSearch(...args));
  },
  deleteMedicinePrevSearch (...args) {
    return dispatch(deleteMedicinePrevSearch(...args));
  },
  removeEncyclopediaMedicine (...args) {
    return dispatch(removeEncyclopediaMedicine(...args));
  },
  removeAllEncyclopediaMedicine (...args) {
    return dispatch(removeAllEncyclopediaMedicine(...args));
  },
  saveEncyclopediaMedicineSearchItem (...args) {
    return dispatch(saveEncyclopediaMedicineSearchItem(...args));
  },
  fetchMedicineSearchHistory (...args) {
    return dispatch(fetchMedicineSearchHistory(...args));
  },
  emptyEncyclopediaMedicine (...args) {
    return dispatch(emptyEncyclopediaMedicine(...args));
  },
  onUpdateLanguage (...args) {
    dispatch(localeSet(...args));
    return Promise.resolve();
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Encyclopedia));
