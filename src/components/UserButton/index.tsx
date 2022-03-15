import React from 'react';
import 'antd/dist/antd.css';
import styled from 'styled-components';
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

declare const window: Window & {
    gapi: any;
};

const UserButton = (_props: any) => {
    // 버튼 활성화 상태 값
    const [disable, setDisable] = useState(false);

    // 출근 상태 값 (reverseDisable에 넣어주기 위함)
    const [checkInState, setCheckInState] = useState({
        checkIn: moment().format('YYYY MM월 DD일,HH:mm:ss')
    });
    
    // 단순 연산을 위한 상태값(format x)
    const [workTime, setWorkTime] = useState({});

    // 근무 상태 값
    const [workState, setWorkState] = useState('');
    

    const btnDisable =  async () => {
        const attendanceDate = moment().format('YYYY MM월 DD일,HH:mm:ss'); 
        console.log('출근시간',attendanceDate);
        setDisable(true);

        // 출근버튼 클릭 시 workTime에 출근시간 값 저장
        setWorkTime(moment((new Date())));
        setCheckInState({...checkInState, checkIn:attendanceDate});
        // 데이터저장
        // window.localStorage.setItem('workTime', String(workTime));
        console.log(window.localStorage)
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const res = await fetch(
                'https://api.apispreadsheets.com/data/ghkpB5QlIc0tKUFJ/'
                ,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({'data':
                    {
                        // 사용자가 로그인을 하면 localStorage에 user_name 값이 남게 된다.
                        'team': 'R&D', 'user': window.localStorage.user_name,
                        'checkIn': checkInState.checkIn, 'workState': '근무미달', 'working': '출근'
                    }
                })
                }
            );
        } catch(err){
            console.log('error:', err);
        }   
    }

    const reverseDisable = async () => {
        const leaveDate = moment(new Date()).format('YYYY MM월 DD일,HH:mm:ss'); 
        console.log('퇴근시간',leaveDate);

        // 단순 연산을 위한 변수(format x)
        const leaveDate2 = Number(moment(new Date()));
        // 퇴근시간 - 출근시간 
        const subtract = Math.floor(((leaveDate2 - Number(workTime))/1000)/60/60);
        setDisable(false);

        // subtract에는 퇴근시간 - 출근시간 의 값이 들어있다.
        // 이 값이 3.24e+7(9시간을 ms로 환산한 값, 32400000)보다 작으면 근무미달
        // 그 외의 나머지 조건은 모두 정상
        if (subtract < 3.24e+7) {
            console.log('근무시간:',subtract,'시간',' 근무미달');
            setWorkState('근무미달');
        }
        else if (subtract >= 3.24e+7) {
            console.log('정상');
            setWorkState('정상');
        }
        else {
            console.log('undefined');
            setWorkState('undefined');
        }
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const res = await fetch(
                'https://api.apispreadsheets.com/data/ghkpB5QlIc0tKUFJ/'
                ,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({'data':
                    {
                        // 사용자가 로그인을 하면 localStorage에 user_name 값이 남게 된다.
                        'checkOut': leaveDate, 
                        'workTime': subtract + " 시간", 'workState': workState, 'working': '퇴근'
                    },
                    // 쿼리문을 사용해 데이터 업데이트 
                    "query": `select*from23774wherecheckIn='${checkInState.checkIn}'`
                })
                }
            );
            // window.location.reload();
        } catch(err){
            console.log('error:', err);
        }   
    }

    return (
        <div key={'UB'}>
            <Container>
                <Button type='primary' disabled={disable} onClick={btnDisable}>출근</Button>
            </Container>
            <Container2>
                <Button type='primary' disabled={!disable} onClick={reverseDisable}>퇴근</Button>
            </Container2>
        </div>
    );
};

export default UserButton;