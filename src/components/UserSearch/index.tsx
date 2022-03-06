import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Input, Space } from 'antd';

const { Search } = Input;

const onSearch = (value: any) => console.log(value);

const UserSearch = (_props: any) => {
    const [size] = useState(8);

    return (
        <div>
            <Space size={size}>
                <Search placeholder="이름" 
                    onSearch={onSearch} 
                    style={{ 
                        width: 200, 
                        top: 14,
                        left:'300px',
                        position: 'fixed'
                    }} 
                />
            </Space>
        </div>
    )
}

export default UserSearch;