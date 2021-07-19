import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Icon, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import * as R from 'ramda';
import { SanitizeHTML } from '../../components/SanitizeHTML/SanitizeHTML';
import { FormattedMessage } from 'react-intl';
const COUNT_OF_ENCICLOPEDIA_DESCRIPTION = 180;

const CustomTag = ({ tags, handleClick, keyTag }) => {
  const sortData = R.groupWith((a, b) => a.key === b.key, R.sortBy(R.prop('name'), R.clone(tags)));

  return sortData[0].map((tag, i) => {
    if (tag.description !== '' && tag.description !== undefined) {
      return (
        <Tag
          key={i}
          onClick={() => handleClick(tag, keyTag)}
          className={`${tag.isSelected ? 'checkedTag' : 'uncheckedTag'} ${window.orientation !== undefined ? 'mobile' : ''}`}
          style={{ marginRight: 5 }}
        >
          <Tooltip
          overlayClassName="profile_custom_tooltip"
          key={i}
          title={props => {
            const link = (tag.encyclopediaId) ? `/encyclopedia/${tag.encyclopediaId}?lang=${localStorage.getItem('language') || 'en'}` : null;
            const description =   ((tag.description || '').length > COUNT_OF_ENCICLOPEDIA_DESCRIPTION)
              ? (`${(tag.description || '').substr(0, COUNT_OF_ENCICLOPEDIA_DESCRIPTION)}`.concat('...'))
              : tag.description;

            return (
              <div>
              <span className="metrics-ant-tooltip-inner">
                <SanitizeHTML html={description} />
              </span>
              <p style={{textAlign:'right'}}>
                {
                  link
                  ? <Link to={link} style={{color:'#fff', textDecoration: 'underline'}}>
                    <FormattedMessage id="SymptomCheckerSideBar.readMore" />
                  </Link> : null
                }
              </p>
            </div>
          );
          }}
          placement={'bottom'}
          >
            {tag.name}
            <Icon className={tag.isSelected ? 'added' : 'notAdded'} type="plus"/>
          </Tooltip>
        </Tag>
      );
    }

    return (
      <Tag
        key={i}
        onClick={() => handleClick(tag, keyTag)}
        className={tag.isSelected ? 'checkedTag' : 'uncheckedTag'}
        style={{ marginRight: 5 }}
      >
        {tag.name}
        <Icon className={tag.isSelected ? 'added' : 'notAdded'} type="plus"
        />
      </Tag>
    );
  });
};

CustomTag.propTypes = {

  handleClick: PropTypes.func,
  tags: PropTypes.array,
  keyTag: PropTypes.string
};
CustomTag.defaultProps = {
  handleClick: () => true,
  tags: [],
  keyTag: ''
};

export default CustomTag;
