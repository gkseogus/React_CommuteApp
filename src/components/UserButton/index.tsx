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

    // 단순 연산을 위한 상태값(format x)
    const [workTime, setWorkTime] = useState({});

    const btnDisable = async () => {
        setDisable(true)
        // 출근버튼 클릭 시 workTime에 출근시간 값 저장
        setWorkTime(moment((new Date())));

        // 데이터 삽입을 위한 format 
        const attendanceDate = moment(new Date()).format('YYYY MM월 DD일,HH:mm:ss'); 
        console.log('출근시간',attendanceDate);
        try {
            const res = await Promise.allSettled([fetch(
                'https://api.apispreadsheets.com/data/6N3SdZx9voMzw0Bc/'
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
            setCheckInState({...checkInState, checkIn:attendanceDate});
        } catch(err){
            console.log('error:', err);
        }
    }

    const reverseDisable = async () => {
        setDisable(false);
        
        const leaveDate = moment(new Date()).format('YYYY MM월 DD일,HH:mm:ss'); 
        console.log('퇴근시간',leaveDate);

        // 현재시간에서 9시간 뺀 값
        const subHours = moment(new Date()).subtract(9, 'h').format('YYYY MM월 DD일,HH:mm:ss');
        
        // 단순 연산을 위한 변수(format x)
        const leaveDate2 = Number(moment(new Date()));
        // 퇴근시간 - 출근시간 
        const subtract = leaveDate2-Number(workTime);

        // subHours의 시간은 현재시간에서 9시간 뺀 값
        // 즉 정상 근무를 하였으면 퇴근시간 - 9시간 = 출근시간 
        // 만약 출근시간이랑 동일하지 않으면 그것은 근무미달
        // if(subHours !== checkInState.checkIn){
        //     console.log("근무미달");
        //     setWorkState("근무미달");
        // }
        // else {
        //     console.log("정상");
        //     setWorkState("정상");  
        // }

        // subtract에는 퇴근시간 - 출근시간 의 값이 들어있다.
        // 이 값이 3.24e+7(9시간을 ms로 환산한 값, 32400000)보다 작으면 근무미달
        // 그 외의 나머지 조건은 모두 정상
        if (subtract < 3.24e+7) {
            console.log("근무시간:",subtract,'    ',"근무미달");
            setWorkState("근무미달");
        }
        else {
            console.log("정상");
            setWorkState("정상");
        }
        try {
            const res = await Promise.allSettled([fetch(
                'https://api.apispreadsheets.com/data/6N3SdZx9voMzw0Bc/'
                ,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({"data":
                {"checkOut": checkOutState.checkOut, "working": "퇴근", "workTime": subtract, "workState": workState}
                })
                }
            )]);
            console.log(res);
            setCheckOutState({...checkOutState, checkOut:leaveDate});
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