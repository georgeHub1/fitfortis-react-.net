import React from 'react';
import { Menu, Dropdown, Icon } from 'antd';

import styles from './styles.module.less';

const CustomDropDown = ({ selected, items, setSelectedItem }) => {
  return (
    <Dropdown overlay={
      <Menu>
        {
          items.map((el, i) => (
            <Menu.Item key={ i } className={ styles.dropDownItem } onClick={ () => setSelectedItem(el) }>
              { el }
            </Menu.Item>
          ))
        }
      </Menu>
      } trigger={['click']}>
      <span
        className={ styles.dropDownLink } >
         { selected } <Icon type="down" />
      </span>
    </Dropdown>
  );
};

export default CustomDropDown;
