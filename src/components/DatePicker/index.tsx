import React from 'react';
import 'antd/dist/antd.css';
import { DatePicker, Space } from 'antd';

const HomeDatePicker = (_props: any) => {
  return (
    <Space key={'DP'} direction='vertical' size={12}>
    <DatePicker
      format='YYYY-MM-DD'
      onChange={_props.onChange}
    />
    </Space>
  );
};

export default HomeDatePicker;
