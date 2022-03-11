import React from 'react';
import 'antd/dist/antd.css';
import styled from "styled-components";
import { Button } from 'antd';
import moment from 'moment';
import { useState } from 'react';

const Container = styled.div`
    position: fixed;
    right: 80px;
`;

const Container2 = styled.div`
    position: fixed;
    right: 10px;
`;

const UserButton = (_props: any) => {
    
    const [disable, setDisable] = useState(false);
    const [checkInState, setCheckInState] = useState({
        checkIn: moment(new Date()).format('YYYY DD월 MM일,HH:mm:ss')
    })
    const [checkOutState, setCheckOutState] = useState({
        checkOut: moment(new Date()).format('YYYY DD월 MM일,HH:mm:ss')
    })

    const btnDisable = async () => {
        setDisable(true)
        // 데이터 삽입을 위한 format 
        const newDate = moment(new Date()).format('YYYY DD월 MM일,HH:mm:ss');  
        console.log('출근시간',newDate)
        try {
            const res = await fetch(
                'https://api.apispreadsheets.com/data/MGx78iL3ZrDWTQgw/'
                ,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({"data":
                {"checkIn": checkInState.checkIn}
                })
                }
            );
            await res.json();
            setCheckInState({...checkInState, checkIn:newDate})
        } catch(err){
            console.log('error:', err);
        }
    }

    const reverseDisable = async () => {
        setDisable(false)
        const newDate = moment(new Date()).format('YYYY DD월 MM일,HH:mm:ss');
        console.log('퇴근시간',newDate)
        try {
            const res = await fetch(
                'https://api.apispreadsheets.com/data/MGx78iL3ZrDWTQgw/'
                ,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({"data":
                {"checkOut": checkOutState.checkOut}
                })
                }
            );
            await res.json();
            setCheckOutState({...checkOutState, checkOut:newDate})
        } catch(err){
            console.log('error:', err);
        }
    }

    return (
        <div>
            <Container>
                <Button type="primary" disabled={disable} onClick={btnDisable}>출근</Button>
            </Container>
            <Container2>
                <Button type="primary" disabled={!disable} onClick={reverseDisable}>퇴근</Button>
            </Container2>
        </div>
    );
};

export default UserButton;