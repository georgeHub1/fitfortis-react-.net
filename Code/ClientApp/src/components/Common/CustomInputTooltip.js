import React from 'react';
import { Tooltip } from 'antd';

const CustomInputTooltip = ({err, text, placement = 'right'}) => {
  return (
    <Tooltip
      overlayClassName="tooltipError"
      visible={err}
      placement={placement}
      title={text}
    >
      <span
        style={{
          width: 12,
          height: 12,
          display: 'inline-block'
        }}
      />
    </Tooltip>
  );
};

export default CustomInputTooltip;
