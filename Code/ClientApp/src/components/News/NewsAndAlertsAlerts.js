import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Icon, Typography } from 'antd';
import styles from './styles.module.less';
import news1 from '../../img/news/news1.png';
import { alertList } from './const';

const { Title } = Typography;
const { Paragraph } = Typography;

class Alert extends Component {
  constructor (props) {
    super(props);
    this.state = {
      list: alertList
    };
  }

  getClassName = type => {
    if (type === 'red') {
      return styles.redAlert;
    } else if (type === 'blue') {
      return styles.blueAlert;
    }
    return '';
  }

  removeItem = index => {
    const { list } = this.state;

    list.splice(index, 1);
    this.setState({ ...this.state, list});
  }

  render () {
    const { list } = this.state;

    return (
      <div className={styles.alertList}>
        {
          list.map((data, key) => {
            return (
              <div key={key} className={`${styles.alertListItem} ${this.getClassName(data.type)}`}>
                {
                  data.image ? (
                    <div className={styles.alertImg}>
                      <img
                        alt="example"
                        src={news1}
                      />
                    </div>
                  ) : ('')
                }
                <div className={styles.alertContent}>
                  <Button className={styles.closeBtn} onClick={() => this.removeItem(key)}>
                    <Icon type="close" className={styles.closeBtnIcon}/>
                  </Button>
                  <span>2019/09/01 10:27 AM</span>
                  <Title level={2} className={styles.title}>{data.title}</Title>
                  <Paragraph className={styles.dec}>
                    {data.descrption}
                  </Paragraph>
                  <Button type="primary" className={styles.scheduleBtn}>
                    <FormattedMessage id="NewsAndAlertsAlerts.schedule" />
                  </Button>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
}
export default injectIntl(Alert);
