import { Button } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { ApplicationState } from '../../store';
import { teamDate } from '../../teamData';

const Container = styled.div`
  position: fixed;
  right: 80px;
`;

const Container2 = styled.div`
  position: fixed;
  right: 10px;
`;

export declare const window: Window & {
  gapi: any;
};

/* 
    
*/
function useCheckInOutData() {
  const userId = window.sessionStorage.user_id;
  const data = useSelector((state: ApplicationState) => state.inventory.data);

  // 테이블 데이터중 key와 user_id 가 일치하는 항목을 탐색
  const index = data.findIndex((row) => row.key === userId);

  // 해당 유저와 일치하는 항목이 없는 경우
  if (index < 0) {
    return { isCheckIn: false, isCheckOut: false, lastIndex: data.length + 1 };
  }

  // 해당 유저와 일치하는 항목이 있는 경우
  const isCheckIn = !!data[index].checkIn; // checkIn 컬럼에 데이터가 있으면 checkIn이 된 것으로 처리
  const isCheckOut = !!data[index].checkOut; // checkOut 컬럼에 데이터가 있으면 checkOut 된 것으로 처리
  return {
    isCheckIn,
    isCheckOut,
    data: { index: index + 1, ...data[index] },
    lastIndex: data.length + 1,
  };

  // index + 1 해주는 이유는 스프레드 시트의 index 번호는 1번부터 시작해서 맞춰줘야함
}

const UserButton = (_props: any) => {
  const checkInOut = useCheckInOutData();
  // 버튼의 disable 활성화 상태 값

  const checkInButtonDisaled = checkInOut.isCheckIn;
  const checkOutButtonDisabled = !checkInOut.isCheckIn || checkInOut.isCheckOut;

  const btnDisable = async () => {
    const userId = window.sessionStorage.user_id;
    const userName = window.sessionStorage.user_name;
    const attendanceDate = moment().format('YYYY MM월 DD일, HH:mm:ss');

    console.log('출근시간', attendanceDate);
    // console.log('sessionStorage',window.sessionStorage);

    // 로그인 사용자의 id를 조회해 팀 값을 결정
    let team = '';
    for (let i = 0; i < teamDate.length; i++) {
      if (teamDate[i].key === userId) {
        team = teamDate[i].team;
      }
    }
    const sheetId = moment().format('YYYY-MM-DD');

    try {
      // 기존 데이터가 있으면 해당 index에, 없으면 마지막 index에 추가
      const index = checkInOut.data?.index ?? checkInOut.lastIndex;
      await window.gapi.client.sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: '1MCnYjLcdHg7Vu9GUSiOwWxSLDTK__PzNod5mCLnVIwQ',
        valueInputOption: 'USER_ENTERED',
        data: [
          {
            // 오늘 시트의 A index 번째 컬럼부터 H index 번째 컬럼까지 데이터를 채움
            range: `'${sheetId}'!A${index}:H${index}`,
            values: [
              [
                team,
                userName,
                attendanceDate,
                '',
                '',
                '근무미달',
                '출근',
                userId,
              ],
            ],
          },
        ],
      });
      window.location.reload();
    } catch (err) {
      console.log('error:', err);
    }
  };

  const reverseDisable = async () => {
    const userId = window.sessionStorage.user_id;
    // moment 연산을 위한 변수 재지정
    const leaveDate = moment(new Date());

    const leaveDateFormat = leaveDate.format('YYYY MM월 DD일, HH:mm:ss');
    console.log('퇴근시간', leaveDateFormat);
    // console.log('sessionStorage',window.sessionStorage);

    // 퇴근시간 - 출근시간
    const subtractTime = moment(leaveDate, 'YYYY MM월 DD일, HH:mm:ss').diff(
      moment(checkInOut.data?.checkIn, 'YYYY MM월 DD일, HH:mm:ss')
    );
    const momentDuration = moment.duration(subtractTime);
    const time =
      Math.floor(momentDuration.asHours()) +
      ' 시간' +
      moment.utc(subtractTime).format(' mm 분 ss 초');

    // 시간으로만 근무상태를 판별하기 위한 변수
    const workHours = Math.floor(momentDuration.asHours());
    const workState =
      workHours >= 9 ? '정상' : workHours < 9 ? '근무미달' : '근무상태 오류';

    const sheetId = moment().format('YYYY-MM-DD');
    try {
      const index = checkInOut.data?.index ?? checkInOut.lastIndex;
      await window.gapi.client.sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: '1MCnYjLcdHg7Vu9GUSiOwWxSLDTK__PzNod5mCLnVIwQ',
        valueInputOption: 'USER_ENTERED',
        data: [
          {
            // 오늘 시트의 D index 번째 컬럼부터 G index 번째 컬럼까지 데이터를 채움
            range: `'${sheetId}'!D${index}:H${index}`,
            values: [[leaveDateFormat, time, workState, '퇴근', userId]],
          },
        ],
      });
      window.location.reload();
    } catch (err) {
      console.log('error:', err);
    }
  };

  return (
    <div key={'UB'}>
      <Container>
        <Button
          type="primary"
          disabled={checkInButtonDisaled}
          onClick={btnDisable}
        >
          출근
        </Button>
      </Container>
      <Container2>
        <Button
          type="primary"
          disabled={checkOutButtonDisabled}
          onClick={reverseDisable}
        >
          퇴근
        </Button>
      </Container2>
    </div>
  );
};

export default React.memo(UserButton);
