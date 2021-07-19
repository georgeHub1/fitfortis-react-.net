import React from 'react';
import { Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { SanitizeHTML } from '../../components/SanitizeHTML/SanitizeHTML';
import { FormattedMessage } from 'react-intl';
const COUNT_OF_ENCICLOPEDIA_DESCRIPTION = 180;

const CustomHeaderTooltip = ({ header, description, encyclopediaId }) => {
    if (encyclopediaId !== undefined) {
      return (
          <Tooltip
          overlayClassName="profile_custom_tooltip"
          title={props => {
            const link = (encyclopediaId) ? `/encyclopedia/${encyclopediaId}?lang=${localStorage.getItem('language') || 'en'}` : null;
            const shortDescription =   ((description || '').length > COUNT_OF_ENCICLOPEDIA_DESCRIPTION)
              ? (`${(description || '').substr(0, COUNT_OF_ENCICLOPEDIA_DESCRIPTION)}`.concat('...'))
              : description;

            return (
              <div>
              <span className="metrics-ant-tooltip-inner">
                <SanitizeHTML html={shortDescription} />
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
            {header}
          </Tooltip>
      );
    }

    return header;
};

export default CustomHeaderTooltip;
