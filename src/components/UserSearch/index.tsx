import { Input, Space, Button } from 'antd';
import 'antd/dist/antd.css';
import React, { useState } from 'react';

const UserSearch = (props: any) => {
  const { Search } = Input;
  const [size] = useState<number>(8);

  return (
    <Space size={size}>
      <Search
        placeholder="이름"
        onSearch={props.onSearch}
        enterButton={
          <Button
            style={{
              top: 14,
              left: '590px',
              position: 'fixed',
              color: 'black',
            }}
          >
            검색
          </Button>
        }
        allowClear
        style={{
          width: 200,
          top: 14,
          left: '380px',
          position: 'fixed',
        }}
      />
    </Space>
  );
};

export default React.memo(UserSearch);
