import React from 'react';
import 'antd/dist/antd.css';
import { DatePicker, Space } from 'antd';

const HomeDatePicker = (props: any) => {
  return (
    <Space direction="vertical" size={12}>
      <DatePicker format="YYYY-MM-DD" onChange={props.onChange} />
    </Space>
  );
};

export default React.memo(HomeDatePicker);
