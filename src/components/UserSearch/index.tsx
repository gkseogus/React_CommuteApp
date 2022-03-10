import { Input, Space, Button } from 'antd';
import 'antd/dist/antd.css';
import _ from 'lodash';
import React, { useState } from 'react';
import styled from 'styled-components';

const ButtonContainer = styled.div`
`

const { Search } = Input;

const UserSearch = (_props: any) => {
  const [size] = useState(8);

  return (
    <ButtonContainer>
      <Space size={size}>
        <Search
          placeholder="이름"
          onSearch={_props.onSearch}
          enterButton={
            <Button 
              style={{
                top: 14,
                left: '510px',
                position: 'fixed',
                color: 'black',
              }} 
            >검색</Button>
          } // enterButton="검색"
          allowClear
          style={{
            width: 200,
            top: 14,
            left: '300px',
            position: 'fixed'
          }}
        />
      </Space>
    </ButtonContainer>
  );
};

export default UserSearch;
