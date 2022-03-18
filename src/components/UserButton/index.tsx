import React from 'react';
import 'antd/dist/antd.css';
import styled from 'styled-components';
import { Button } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useEffect } from 'react';
import { teamDate } from '../../teamData';
import { trackPromise } from 'react-promise-tracker';

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

    const btnDisable =  async () => {
        const attendanceDate = moment().format('YYYY MM월 DD일, HH:mm:ss'); 

        window.sessionStorage.setItem('check_in', attendanceDate);
        console.log('출근시간',attendanceDate);
        // console.log('sessionStorage',window.sessionStorage);

        setDisableBtn(true);
        setDisableRevers(false);

        // 로그인 사용자의 id를 조회해 팀 값을 결정
        let team = '';
        for (let i=0; i<teamDate.length; i++) {
            if(teamDate[i].key === window.sessionStorage.user_id){
                team = teamDate[i].team;
            }
        }

        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const res = await trackPromise(fetch(
                'https://api.apispreadsheets.com/data/5Up0ldXSWMxKoiVR/'
                ,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({'data':
                    {
                        // 사용자가 로그인을 하면 sessionStorage에 user_name 값이 남게 된다.
                        'team': team, 
                        'user': window.sessionStorage.user_name,
                        'checkIn': attendanceDate, 
                        'workState': '근무미달', 
                        'working': '출근',
                        'key': window.sessionStorage.user_id
                    }
                })
                }
            ));
        window.location.reload();
        } catch(err){
            console.log('error:', err);
        }   
    };

const reverseDisable = async () => {
        // moment 연산을 위한 변수 재지정
        const leaveDate = moment(new Date());
        
        const leaveDateFormat = leaveDate.format('YYYY MM월 DD일, HH:mm:ss'); 
        window.sessionStorage.setItem('check_out', leaveDateFormat);
        console.log('퇴근시간',leaveDateFormat);
        // console.log('sessionStorage',window.sessionStorage);

        setDisableBtn(true);
        setDisableRevers(true);

        // 퇴근시간 - 출근시간 
        const subtractTime = moment(leaveDate, 'YYYY MM월 DD일, HH:mm:ss').diff(moment(window.sessionStorage.check_in, 'YYYY MM월 DD일, HH:mm:ss'));
        const momentDuration = moment.duration(subtractTime);
        const time = Math.floor(momentDuration.asHours()) + ' 시간' + moment.utc(subtractTime).format(' mm 분 ss 초');

        // 시간으로만 근무상태를 판별하기 위한 변수
        const workHours = Math.floor(momentDuration.asHours());
        const workState = (workHours >= 9) ? '정상' : (workHours < 9) ?  '근무미달' : '근무상태 오류'

        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const res = await trackPromise(fetch(
                'https://api.apispreadsheets.com/data/5Up0ldXSWMxKoiVR/'
                ,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({'data':
                    {
                        // 사용자가 로그인을 하면 sessionStorage에 user_name 값이 남게 된다.
                        'checkOut': leaveDateFormat, 
                        'workTime': time,
                        'workState': workState, 
                        'working': '퇴근'
                    },
                    // 쿼리문을 사용해 데이터 업데이트 
                    "query": `select*from23877wherekey='${window.sessionStorage.user_id}'`
                })
                }
            ));
            window.location.reload();
        } catch(err){
            console.log('error:', err);
        }   
    };

    // 출퇴근 버튼 활성화 조건
    useEffect(() => {
        // console.log('sessionStorage check_in',window.sessionStorage.check_in);
        // console.log('sessionStorage check_out',window.sessionStorage.check_out);

        if(window.sessionStorage.user_name !== undefined && window.sessionStorage.check_in === undefined){
            console.log('로그인 성공');
            setDisableBtn(false);
        }
        else if(window.sessionStorage.check_in !== undefined && window.sessionStorage.check_out === undefined){
            setDisableBtn(true);
            setDisableRevers(false);
        }
        else if(window.localStorage.check_out !== undefined && window.sessionStorage.check_out !== undefined){
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

export default React.memo(UserButton);