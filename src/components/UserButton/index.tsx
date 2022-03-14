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
        checkIn: moment(new Date()).format('YYYY MM월 DD일,HH:mm:ss')
    });
    const [checkOutState, setCheckOutState] = useState({
        checkOut: moment(new Date()).format('YYYY MM월 DD일,HH:mm:ss')
    });
    
    const [workState, setWorkState] = useState("");

    const btnDisable = async () => {
        setDisable(true)

        // 데이터 삽입을 위한 format 
        const newDate = moment(new Date()).format('YYYY MM월 DD일,HH:mm:ss'); 
        console.log('출근시간',newDate);
        try {
            const res = await Promise.allSettled([fetch(
                'https://api.apispreadsheets.com/data/YN1QAPcdoAu294nX/'
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
            setCheckInState({...checkInState, checkIn:newDate});
        } catch(err){
            console.log('error:', err);
        }
    }

    const reverseDisable = async () => {
        setDisable(false);
        
        const newDate = moment(new Date()).format('YYYY MM월 DD일,HH:mm:ss'); 
        const subHours = moment(new Date()).subtract(9, 'h').format('YYYY MM월 DD일,HH:mm:ss');
        console.log('퇴근시간',newDate);
        // subHours의 시간은 현재시간에서 9시간 뺀 값
        // 즉 정상 근무를 하였으면 퇴근시간 - 9시간 = 출근시간 
        // 만약 출근시간이랑 동일하지 않으면 그것은 근무미달
        if(subHours !== checkInState.checkIn){
            setWorkState("근무미달");
        }
        else {
            setWorkState("정상");  
        }
        // console.log('test', moment.duration(subHours.diff(checkInState.checkIn)).asHours())
        try {
            const res = await Promise.allSettled([fetch(
                'https://api.apispreadsheets.com/data/YN1QAPcdoAu294nX/'
                ,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({"data":
                {"checkOut": checkOutState.checkOut, "working": "퇴근", "workTime": subHours, "workState": workState}
                })
                }
            )]);
            console.log(res);
            setCheckOutState({...checkOutState, checkOut:newDate});
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