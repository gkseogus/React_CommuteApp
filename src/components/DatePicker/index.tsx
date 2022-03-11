import React from 'react';
import 'antd/dist/antd.css';
import { DatePicker, Space } from 'antd';

const { RangePicker } = DatePicker;

const HomeDatePicker = (_props: any) => {
  return (
    <Space key={"DP"} direction="vertical" size={12}>
    <RangePicker
      showTime={{ format: 'HH:mm' }}
      format="YYYY-MM-DD HH:mm"
      onChange={_props.onChange}
    />
    </Space>
  );
};

export default HomeDatePicker;
