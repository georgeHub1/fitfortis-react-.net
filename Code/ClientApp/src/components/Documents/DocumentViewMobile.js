import React from 'react';
import moment from 'moment';
import { Icon, Dropdown } from 'antd';
import { ReactComponent as DocumentIcon } from '../../img/documentIcon.svg';
import { ReactComponent as AudioIcon } from '../../img/audioIcon.svg';
import { ReactComponent as ImageIcon } from '../../img/imageIcon.svg';
import { ReactComponent as PdfIcon } from '../../img/pdfIcon.svg';

import { getColorClass } from './util';
import styles from './styles.module.less';

export const DocumentMobileView = ({fileName, description, contentType, date, type, activeView, menu, modal, data, higlightedText, searchText,
  selected, onChangeCheckbox, allData}) => {
  return (
    <div className="documentMobileView">
      <div className="documentMobileView_head">
        <span>{moment(new Date(date)).format('MM/DD/YYYY hh:mm a')}</span>
        <Dropdown overlay={menu} trigger={['click']}>
          <Icon type="more" />
        </Dropdown>
      </div>
      <div className="documentMobileView_content">
        <div className={`${styles.typeBox} ${styles[getColorClass(type)]}`}>
            { data.contentType.includes('image') && <Icon component={ImageIcon} /> }
            { data.contentType.includes('video') && <Icon component={AudioIcon} /> }
            { data.contentType.includes('application/pdf') && <Icon component={PdfIcon} /> }
            { !data.contentType.includes('image') && !data.contentType.includes('video') && !data.contentType.includes('application/pdf') && <Icon component={DocumentIcon} /> }
            <span className={styles.fileSize}>{data.fileSize !== '' && data.fileSize > '0' ? data.fileSize  : ''}</span>
         </div>
        <div className="fileText">
          <h4 onClick={() => {
            if (activeView === 'all') {
              modal(data);
            }
          }}>{higlightedText(searchText, fileName)}</h4>
          <p>{higlightedText(searchText, description)}</p>
        </div>
      </div>
    </div>
  );
};
