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
        console.log('출근시간',newDate);
        try {
            const res = await Promise.allSettled([fetch(
                'https://api.apispreadsheets.com/data/1Hu1GF1mNrXIVgOt/'
                ,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({"data":
                {"checkIn": checkInState.checkIn, "working": "출근"}
                })
                }
            )]);
            console.log(res);
            setCheckInState({...checkInState, checkIn:newDate})
        } catch(err){
            console.log('error:', err);
        }
    }

    const reverseDisable = async () => {
        setDisable(false)
        
        // 단순 api에 데이터를 보내주기 위한 변수
        const newDate = moment(new Date()).format('YYYY DD월 MM일,HH:mm:ss'); 
        console.log('퇴근시간',newDate);

        // (퇴근시간 - 출근시간) 연산을 위한 변수
        const wenDate = moment();
        console.log('wEN',wenDate)
        console.log('rere',checkInState.checkIn)
        console.log('test', moment.duration(wenDate.diff(checkInState.checkIn)).asHours())
        try {
            const res = await Promise.allSettled([fetch(
                'https://api.apispreadsheets.com/data/1Hu1GF1mNrXIVgOt/'
                ,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({"data":
                {"checkOut": checkOutState.checkOut, "working": "퇴근"}
                })
                }
            )]);
            console.log(res);
            setCheckOutState({...checkOutState, checkOut:newDate})
        } catch(err){
            console.log('error:', err);
        }
    }

    return (
        <div key={"UB"}>
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