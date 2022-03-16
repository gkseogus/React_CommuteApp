import React from 'react';
import 'antd/dist/antd.css';
import styled from 'styled-components';
import { Button } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useEffect } from 'react';

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
    // 버튼의 disable 활성화 상태 값
    const [disableBtn, setDisableBtn] = useState(true);
    const [disableRevers, setDisableRevers] = useState(true);

    // 출근 상태 값 (reverseDisable에 넣어주기 위함)
    const [checkInState, setCheckInState] = useState({
        checkIn: ''
    });
    
    // 단순 연산을 위한 상태값(format x)
    const [workTime, setWorkTime] = useState({});

    // 근무 상태 값
    const [workState, setWorkState] = useState('근무미달');

    const btnDisable =  async () => {
        const attendanceDate = moment().format('YYYY MM월 DD일,HH:mm:ss'); 
        window.sessionStorage.setItem('check_in', attendanceDate);
        console.log('출근시간',attendanceDate);
        console.log('sessionStorage',window.sessionStorage);

        setDisableBtn(true);
        setDisableRevers(false);
        
        // 출근버튼 클릭 시 workTime에 출근시간 값 저장
        setWorkTime(moment((new Date())));
        setCheckInState({...checkInState, checkIn:attendanceDate});

        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const res = await fetch(
                'https://api.apispreadsheets.com/data/FkhpuWth62pJNHjn/'
                ,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({'data':
                    {
                        // 사용자가 로그인을 하면 sessionStorage에 user_name 값이 남게 된다.
                        'team': 'R&D', 
                        'user': window.sessionStorage.user_name,
                        'checkIn': attendanceDate, 
                        'workState': '근무미달', 
                        'working': '출근'
                    }
                })
                }
            );
        } catch(err){
            console.log('error:', err);
        }   
    };

    const reverseDisable = async () => {
        const leaveDate = moment(new Date()).format('YYYY MM월 DD일,HH:mm:ss'); 
        console.log('퇴근시간',leaveDate);
        setDisableBtn(true);
        setDisableRevers(true);

        // 단순 연산을 위한 변수(format x)
        const leaveDate2 = Number(moment(new Date()));

        // 퇴근시간 - 출근시간 
        const subtractHour = Math.floor(((leaveDate2 - Number(workTime))/1000)/60/60);
        const subtractMinute = Math.floor(((leaveDate2 - Number(workTime))/1000)/60);
        const subtractSecond = Math.floor(((leaveDate2 - Number(workTime))/1000));

        // subtractHour에는 퇴근시간 - 출근시간 의 시 값이 들어있다.
        // 이 값이 3.24e+7(9시간을 ms로 환산한 값, 32400000)보다 작으면 근무미달
        if (subtractHour < 3.24e+7) {
            console.log('근무시간:',subtractHour,'시간',subtractMinute,'분',subtractSecond,'초',' 근무미달');
            setWorkState('근무미달');
        }
        else if (subtractHour >= 3.24e+7) {
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
                'https://api.apispreadsheets.com/data/FkhpuWth62pJNHjn/'
                ,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({'data':
                    {
                        // 사용자가 로그인을 하면 sessionStorage에 user_name 값이 남게 된다.
                        'checkOut': leaveDate, 
                        'workTime': subtractHour + " 시간 " + subtractMinute + " 분 " + subtractSecond + " 초", 
                        'workState': workState, 
                        'working': '퇴근'
                    },
                    // 쿼리문을 사용해 데이터 업데이트 
                    "query": `select*from23806wherecheckIn='${checkInState.checkIn}'`
                })
                }
            );
            window.location.reload();
        } catch(err){
            console.log('error:', err);
        }   
    };

    useEffect(() => {
        console.log('sessionStorage',window.sessionStorage);
        // if(window.sessionStorage.check_in !== undefined){
        //     setDisableBtn(true);
        //     setDisableRevers(true);
        //     window.sessionStorage.removeItem('check_in');
        // }
        if(window.sessionStorage.user_name !== undefined){
            setDisableBtn(false);
            setDisableRevers(true);
        }
    },[]);

    return (
        <div key={'UB'}>
            <Container>
                <Button type='primary' disabled={disableBtn} onClick={btnDisable}>출근</Button>
            </Container>
            <Container2>
                <Button type='primary' disabled={disableRevers} onClick={reverseDisable}>퇴근</Button>
            </Container2>
        </div>
    );
};

export default UserButton;