import React from 'react';
import 'antd/dist/antd.css';
import { DatePicker, Space } from 'antd';

const { RangePicker } = DatePicker;

const HomeDatePicker = (_props: any) => {
  return(
  <Space direction="vertical" size={12}>
    <RangePicker />
  </Space>
  )
}

export default HomeDatePicker