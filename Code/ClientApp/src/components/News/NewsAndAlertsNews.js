import React, { Component } from 'react';
import { Input, Button, Icon, Typography, Menu, Dropdown, notification } from 'antd';
import { injectIntl } from 'react-intl';
import styles from './styles.module.less';
import { ReactComponent as share } from '../../img/share.svg';
import { ReactComponent as like } from '../../img/news/like_icon.svg';
import new1 from '../../img/news/news1.png';
import { data, filter } from './const';
import { Link } from 'react-router-dom';

const { Search } = Input;
const { Title } = Typography;
const { Paragraph } = Typography;

class NewsAndAlertsNews extends Component {
  constructor (props) {
    super(props);
    this.state = {
      list: data,
      searchText: ''
    };
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

  copyToClipboard = () => {
    const cpLink = window.location.href;

    const textField = document.createElement('textarea');

    textField.innerText = cpLink;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  };
  shareFacebook = (url = 'https://www.google.com/') => {
    return window.open(
      `http://facebook.com/sharer.php?s=100&p[url]=${url}`,
      'fbshare',
      'height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0'
    );
  };
  shareEmail = (url = window.location.href) => {
    return window.open(
      `${'mailto:?cc=&subject=Share a link&body='}${url}`,
      '_self'
    );
  };

  render () {
    const {
      intl: { formatMessage }
    } = this.props;
    const { list, searchText } = this.state;
    const filteredData = filter(list, searchText);
    const openNotification = () => {
      notification.success({
        message: formatMessage({ id: 'NewsAndAlertsNews.copied' })
      });
    };
    const menu = (
      <Menu className="dropDownShareMenu">
        <Menu.Item onClick={() => this.shareFacebook()}>
          <div className={styles.menuItemBlock}>
            <Icon type="facebook" style={{ marginRight: 10 }} />
            <span>{formatMessage({ id: 'NewsAndAlertsNews.shareToFacebook' })}</span>
          </div>
        </Menu.Item>
        <Menu.Item onClick={() => this.shareEmail()}>
          <div className={styles.menuItemBlock}>
            <Icon type="mail" style={{ marginRight: 10 }} />
            <span>{formatMessage({ id: 'NewsAndAlertsNews.shareToEmail' })}</span>
          </div>
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            openNotification();
            this.copyToClipboard();
          }}
        >
          <div className={styles.menuItemBlock}>
            <Icon type="paper-clip" style={{ marginRight: 10 }} />
            <span>{formatMessage({ id: 'NewsAndAlertsNews.copyLink' })}</span>
          </div>
        </Menu.Item>
      </Menu>
    );

    return (
      <div>
        <div className="searchBox">
          <Search
            placeholder={formatMessage({ id: 'NewsAndAlertsNews.search' })}
            onChange={e => {
              this.setState({ ...this.state, searchText: e.target.value });
            }}
          />
        </div>
         <div className={styles.newsList} >
          {
            filteredData.map((data, key) => {
              return (
                <div className={styles.newsListItem} key={key}>
                  <img
                    alt="example"
                    src={new1}
                  />
                  <div className={styles.newsListItemContent}>
                    <div className={styles.contentDetails}>
                      <div className={styles.contentDetailLeft}>
                        <span className={styles.date}>2019/09/01 10:27 AM</span>
                        <Title level={2} className={styles.title}>{this.getHighlightedText(searchText, data.title)}</Title>
                      </div>
                      <div className={styles.sharePrintBlock}>
                        <Button type="primary" className={styles.icon}>
                          <Icon component={like} />
                          12345&nbsp;{`${formatMessage({ id: 'NewsAndAlertsNews.likes' })}`}
                        </Button>
                        <Dropdown
                          overlay={menu}
                          trigger={['click']}
                          placement="bottomCenter"
                        >
                          <Button type="primary" className={styles.icon}>
                            <Icon component={share} />
                            {formatMessage({ id: 'NewsAndAlertsNews.share' })}
                          </Button>
                        </Dropdown>
                      </div>
                    </div>
                    <Paragraph className={styles.dec}>
                      {data.description}
                      <Link to={`/news/${data.title}`}>
                        {formatMessage({ id: 'NewsAndAlertsNews.readMore' })}
                      </Link>
                    </Paragraph>
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
export default injectIntl(NewsAndAlertsNews);
