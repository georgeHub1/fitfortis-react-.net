import React, { Component } from 'react';
import { Input, Button, Icon, Typography, Menu, Dropdown, notification } from 'antd';
import { injectIntl } from 'react-intl';
import styles from './styles.module.less';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ReactComponent as share } from '../../img/share.svg';
import { ReactComponent as like } from '../../img/news/like_icon.svg';
import ReactLoading from 'react-loading';
import { data, filter } from './const';
import { Link } from 'react-router-dom';
import { setActiveItem } from '../../redux/item.action';
import { fetchNewsFeedListing, likeNewsFeedItem, unLikeNewsFeedItem, saveNewsSearchItem } from '../../redux/adminTool.action';
import { SanitizeHTML } from '../../components/SanitizeHTML/SanitizeHTML';
import { localeSet } from '../../redux/locale.action';
import analyticId from '../../utils/AnalyticsAndAbTests.tsx';
const { Title } = Typography;
const { Paragraph } = Typography;

class HomeNews extends Component {
  constructor (props) {
    super(props);
    this.state = {
      list: data,
      searchText: '',
      account: props.account,
      abTestUser: '',
      focused: false
    };
  }

  componentWillMount () {
    const { account, intl: { locale }, adminTool: { isNewsFeedLoaded } } = this.props;

    if (window.location.search.includes('?lang=')) {
      const lan = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');

      this.props.onUpdateLanguage(lan);
      localStorage.setItem('language', lan);
    }
    if (!isNewsFeedLoaded) {
      this.props.fetchNewsFeedListing(account.language || locale);
    }
    const intervalId = setInterval(() => {
      const type =  analyticId.abTest_isArticlesInRandomOrder();

      if (type !== undefined) {
        clearInterval(intervalId);
        if (type === true) {
          this.setState({abTestUser: true });
        } else {
          this.setState({ abTestUser: false });
        }
      }
    }, 100);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.account.id !== nextProps.account.id) {
      const { intl: { locale }, adminTool: { isNewsFeedLoaded } } = this.props;
      const { account } = nextProps;

      if (window.location.search.includes('?lang=')) {
        const lan = window.location.search.includes('?lang=') ? window.location.search.substring(6, 11) : (localStorage.getItem('language') || 'en');

        this.props.onUpdateLanguage(lan);
        localStorage.setItem('language', lan);
      }
      if (!isNewsFeedLoaded) {
        this.props.fetchNewsFeedListing(account.language || locale);
      }
    }
  }

  getHighlightedText = (higlight, text) => {
    const parts = text.split(new RegExp(`(${higlight})`, 'gi'));

    return (
      <span key={text}>
        {parts.map((part, i) => (
          <span
            key={i}
            // CUSTOMIZATION
            style={
              // CUSTOMIZATION: colorization of search items in Documents
              higlight !== '' && part.toLowerCase().indexOf(higlight.toLowerCase()) !== -1
                ? { fontWeight: 'bold', backgroundColor: '#FCABF9' }
                : {}
            }
          >
            {part}
          </span>
        ))}
      </span>
    );
  };

  copyToClipboard = (url = window.location.href) => {
    const textField = document.createElement('textarea');

    textField.innerText = url;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  };
  shareFacebook = (url = window.location.href) => {
    analyticId.firebaseAnalyticsLog('Home_NewsfeedEntry_ClickShareOnHomePage', {shareTo: 'shareToFacebook'});
    return window.open(
      `http://facebook.com/sharer.php?s=100&p[url]=${url}`,
      'fbshare',
      'height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0'
    );
  };
  shareEmail = (url = window.location.href) => {
    analyticId.firebaseAnalyticsLog('Home_NewsfeedEntry_ClickShareOnHomePage', {shareTo: 'shareViaEmail'});
    return window.open(
      `${'mailto:?cc=&subject=Share a link&body='}${url}`,
      '_self'
    );
  };

  likeItem = id => {
    const { account } = this.props;

    this.props.likeNewsFeedItem(account.id, id);
  }

  unLikeItem = id => {
    const { account } = this.props;

    this.props.unLikeNewsFeedItem(account.id, id);
  }

  onBlur = () => {
    this.setState({ focused: false }, () => { this.onChange(); });
  }

  onFocus = () => {
    this.setState({ focused: true });
  }

  onChange = () => {
    const { searchText, focused } = this.state;
    const { adminTool: { newsFeeds } } = this.props;
    const filteredData = filter(newsFeeds, searchText);

    if (filteredData.length === 0 && searchText !== '' && focused) {
      this.addNewSearch(searchText, '', false);
    } else if (!focused && searchText !== '' && filteredData.length !== 0) {
      this.addNewSearch(searchText, filteredData[0].id, true);
    }
  }

  addNewSearch = (title, uniqueId, isSuccessful) => {
    const { id } = this.props.account;

    this.props.saveNewsSearchItem(title, uniqueId, id, isSuccessful);
  };
  shuffle = list =>  {
    return list.reduce((p, n) => {
      const size = p.length;
      const index = Math.trunc(Math.random() * (size - 1));

      p.splice(index, 0, n);
      return p;
    }, []);
  };

  render () {
    const {
      intl: { formatMessage, locale },
      adminTool: { isFetching, newsFeeds }
    } = this.props;
    const { searchText, abTestUser } = this.state;

    let filteredData = filter(newsFeeds, searchText);


    if (abTestUser === true) {
      filteredData = this.shuffle(filteredData);
    }
    const openNotification = () => {
      notification.success({
        message: formatMessage({ id: 'HomeNews.copied' })
      });
    };
    const menu = shareUrl => (
      <Menu className="dropDownShareMenu">
        <Menu.Item onClick={() => this.shareFacebook(shareUrl)}>
          <div className={styles.menuItemBlock}>
            <Icon type="facebook" style={{ marginRight: 10 }} />
            <span>{formatMessage({ id: 'HomeNews.shareToFacebook' })}</span>
          </div>
        </Menu.Item>
        <Menu.Item onClick={() => this.shareEmail(shareUrl)}>
          <div className={styles.menuItemBlock}>
            <Icon type="mail" style={{ marginRight: 10 }} />
            <span>{formatMessage({ id: 'HomeNews.shareToEmail' })}</span>
          </div>
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            analyticId.firebaseAnalyticsLog('Home_NewsfeedEntry_ClickShareOnHomePage', {shareTo: 'copyLink'});
            openNotification();
            this.copyToClipboard(shareUrl);
          }}
        >
          <div className={styles.menuItemBlock}>
            <Icon type="paper-clip" style={{ marginRight: 10 }} />
            <span>{formatMessage({ id: 'HomeNews.copyLink' })}</span>
          </div>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className="home-container">
        <div className="searchBox">
          <Input
            type="text"
            id="searchbox"
            aria-label="search box"
            className={styles.searchInput}
            placeholder={formatMessage({ id: 'HomeNews.search' })}
            onChange={e => {
              this.setState({ ...this.state, searchText: e.target.value }, () => { this.onChange(); });
            }}
            prefix={
              <Icon type="search" className={styles.certainCategoryIcon} />
            }
            onBlur={this.onBlur}
            onFocus={this.onFocus}
          />
        </div>
        <div className={styles.newsList} >
          {
            isFetching ? <ReactLoading className="react-loading-center" type="spin" color="#335889"  />
            : filteredData.map((data, key) => {
              return (
                <div className={styles.newsListItem} key={key}>
                  <Link id={`tabpanel-label-image-text${key}`} onClick={() => this.props.setActiveItem(data)}to={`/newsfeed/${data.id}?lang=${locale}`}>
                    <div className={styles.newsListItemImage}>
                      {
                        data.pictureUrl && <img
                          alt="example"
                          lang={locale}
                          loading="lazy"
                          aria-label="Home news article images"
                          src={data.pictureUrl}
                        />
                      }
                      {
                        data.pictureUrl && <div className={styles.contentDetails}>
                            <div className={styles.contentDetailLeft}>
                              <Title level={2} className={styles.title}><mark>{this.getHighlightedText(searchText, data.title)}</mark></Title>
                            </div>
                          </div>
                      }
                    </div>
                  </Link>
                  <div id="tabpanel-label1" className={styles.newsListItemContent}>
                    <div onClick={() => { this.props.setActiveItem(data); this.props.history.push(`/newsfeed/${data.id}?lang=${locale}`); }}>
                      {
                        !(data.pictureUrl) && <div className={styles.contentDetails}>
                            <div className={styles.contentDetailLeft}>
                              <Title level={2} className={styles.title}>{this.getHighlightedText(searchText, data.title)}</Title>
                            </div>
                          </div>
                      }
                      <Paragraph className={styles.dec}>
                        <SanitizeHTML html={data.description.indexOf('<p>') > -1 ? (data.description.substring(data.description.indexOf('<p>') + 3, data.description.indexOf('</p>')).trim()) : ''} />
                        {formatMessage({ id: 'HomeNews.readMore' })}
                      </Paragraph>
                    </div>
                    <div className={styles.sharePrintBlock}>
                      <Dropdown
                        overlay={menu(`${window.location.href}newsfeed/${data.id}?lang=${locale}`)}
                        trigger={['click']}
                        placement="bottomCenter"
                      >
                        <Button type="primary" aria-label="HomeNewsShare" className={styles.icon}>
                          <Icon component={share} />
                          {formatMessage({ id: 'HomeNews.share' })}
                        </Button>
                      </Dropdown>
                        <Button aria-label="HomeNewsLike" onClick={() => {
                          analyticId.firebaseAnalyticsLog('Home_NewsfeedEntry_ClickLikeOnHomePage', {});
                          if (data.isLiked) {
                            this.unLikeItem(data.id);
                          } else {
                            this.likeItem(data.id);
                          }
                        }} type="primary" className={`${styles.icon}`}>
                          <Icon component={like} className={styles.homeNewslike_btn}/>
                          {`${formatMessage({ id: 'HomeNews.like' })}`}
                        </Button>
                        {data.likes ? <h6>{data.likes} {(data.likes > 1) ? formatMessage({ id: 'HomeNews.manyLikesText' }) : formatMessage({ id: 'HomeNews.oneLikeText' })}</h6> : ''}
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}
const mapStateToProps = (({ adminTool, profile: { account } }) => ({ adminTool, account }));

const mapDispatchToProps = dispatch => ({
  setActiveItem: bindActionCreators(setActiveItem, dispatch),
  fetchNewsFeedListing: bindActionCreators(fetchNewsFeedListing, dispatch),
  likeNewsFeedItem: bindActionCreators(likeNewsFeedItem, dispatch),
  unLikeNewsFeedItem: bindActionCreators(unLikeNewsFeedItem, dispatch),
  saveNewsSearchItem: bindActionCreators(saveNewsSearchItem, dispatch),
  onUpdateLanguage (args) {
    dispatch(localeSet(args));
    return Promise.resolve();
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(HomeNews));
