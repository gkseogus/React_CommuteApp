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

    // moment 연산을 위한 상태 값 재지정
    const [workTime, setWorkTime] = useState(moment());

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

        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const res = await fetch(
                'https://api.apispreadsheets.com/data/loZyKVxYh8vRlTOV/'
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
                        'working': '출근',
                        'key': window.sessionStorage.user_id
                    }
                })
                }
            );
        window.location.reload();
        } catch(err){
            console.log('error:', err);
        }   
    };

    const reverseDisable = async () => {
        const leaveDate = moment(new Date()).format('YYYY MM월 DD일,HH:mm:ss'); 
        window.sessionStorage.setItem('check_out', leaveDate);
        console.log('퇴근시간',leaveDate);
        console.log('sessionStorage',window.sessionStorage);

        // moment 연산을 위한 변수 재지정
        const leaveDate2 = moment(new Date());

        setDisableBtn(true);
        setDisableRevers(true);

        // 퇴근시간 - 출근시간 (ms 단위의 결과값을 1000으로 나눔)
        const subtractHours = (moment.duration(leaveDate2.diff(workTime, 'hours')).asHours())*1000;
        const subtractMinute = (moment.duration(leaveDate2.diff(workTime, 'minutes')).asMinutes())*1000;
        const subtractSecond = (moment.duration(leaveDate2.diff(workTime, 'seconds')).asSeconds())*1000;

        // subtractHours에는 퇴근시간 - 출근시간 의 시 값이 들어있다.
        if (subtractHours >=  9) {
            console.log('정상');
            setWorkState('정상');
        }
        else if (subtractHours <  9) {
            console.log('근무시간:',subtractHours,'시간',subtractMinute,'분',subtractSecond,'초',' 근무미달');
            setWorkState('근무미달');
        }
        else {
            console.log('근무상태 오류');
            setWorkState('근무상태 오류');
        }
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const res = await fetch(
                'https://api.apispreadsheets.com/data/loZyKVxYh8vRlTOV/'
                ,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({'data':
                    {
                        // 사용자가 로그인을 하면 sessionStorage에 user_name 값이 남게 된다.
                        'checkOut': leaveDate, 
                        'workTime': subtractHours + ' 시간 ' + subtractMinute + ' 분 ' + subtractSecond + ' 초 ',
                        'workState': workState, 
                        'working': '퇴근'
                    },
                    // 쿼리문을 사용해 데이터 업데이트 
                    "query": `select*from23820wherekey='${window.sessionStorage.user_id}'`
                })
                }
            );
            window.location.reload();
        } catch(err){
            console.log('error:', err);
        }   
    };

    // 출퇴근 버튼 활성화 조건
    useEffect(() => {
        console.log('sessionStorage check_in',window.sessionStorage.check_in);
        console.log('sessionStorage check_out',window.sessionStorage.check_out);

        if(window.sessionStorage.user_name !== undefined && window.sessionStorage.check_in === undefined){
            console.log('로그인 성공');
            setDisableBtn(false);
        }
        else if(window.sessionStorage.check_in !== undefined && window.sessionStorage.check_out === undefined){
            console.log('출근버튼 클릭');
            setDisableBtn(true);
            setDisableRevers(false);
        }
        else if(window.localStorage.check_out !== undefined && window.sessionStorage.check_out !== undefined){
            console.log('퇴근버튼 클릭');
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