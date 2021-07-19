import React from 'react';
import moment from 'moment';
import { Icon, Dropdown } from 'antd';

export const AdminToolsViewMobile = ({title, description, date, language, id, menu, visible, onVisibleChange, data}) => {
  return (
    <div className="adminToolMobileView">
      <div className="adminToolMobileView_head">
        <span>{moment(new Date(date)).format('MM/DD/YYYY hh:mm a')}</span>
        <Dropdown
          trigger={['click']}
          visible={visible(id)}
          onVisibleChange={e => {
            onVisibleChange(e, data);
          }}
          overlay={menu}
          placement="bottomCenter"
        >
          <Icon type="more" />
        </Dropdown>
      </div>
      <div>
        <h4>{title}</h4>
        <p className="responsiveLanguage">{language}</p>
        <p>{description}</p>
      </div>
    </div>
  );
};
