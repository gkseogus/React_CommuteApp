import React from 'react';
import 'antd/dist/antd.css';
import { Button } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { trackPromise } from 'react-promise-tracker';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import styled from 'styled-components';
import { ApplicationState } from '../../store';
import teamData from '../../teamData';
import { converToState, getSheet, loadTodaySheet } from '../GoogleSheet';
import {
  fetchRequest,
  fetchRequestToUpdate,
} from '../../store/inventory/action';

const Container = styled.div`
  position: fixed;
  right: ${(props) => props.id || '250px'};
`;

export declare const window: Window & {
  gapi: any;
};

// 현재 로그인한 유저의 엑셀 row 정보가 담겨있음
const useCheckInOutData = () => {
  const userEmail = window.sessionStorage.user_email;
  const update = useSelector(
    (state: ApplicationState) => state.inventory.update
  );

  // 테이블 데이터중 key와 user_email 가 일치하는 항목을 탐색
  const index = update.findIndex((row) => row.key === userEmail);

  // 해당 유저와 일치하는 항목이 없는 경우
  if (index < 0) {
    return {
      isCheckIn: false,
      isCheckOut: false,
      lastIndex: update.length + 1,
    };
  }

  // 해당 유저와 일치하는 항목이 있는 경우
  const isCheckIn = !!update[index].checkIn; // checkIn 컬럼에 데이터가 있으면 checkIn이 된 것으로 처리
  const isCheckOut = !!update[index].checkOut; // checkOut 컬럼에 데이터가 있으면 checkOut 된 것으로 처리
  return {
    isCheckIn,
    isCheckOut,
    data: { index: index + 1, ...update[index] },
    lastIndex: update.length + 1,
  };

  // index + 1 해주는 이유는 스프레드 시트의 index 번호는 1번부터 시작해서 맞춰줘야함
};

const UserButton = (_props: any) => {
  const dispatch = useDispatch();
  const checkInOut = useCheckInOutData();

  // 버튼의 disable 활성화 상태 값 true이면 비활성화, false이면 활성화
  const checkInButtonDisaled =
    !window.sessionStorage.user_id || checkInOut.isCheckIn;
  const companyWorkButtonDisaled =
    !window.sessionStorage.user_id || checkInOut.isCheckIn;
  const checkOutButtonDisabled = !checkInOut.isCheckIn;

  const btnDisable = async () => {
    const CHECKIN_ALERT = window.confirm('재택 출근하시겠습니까?');
    if (CHECKIN_ALERT) {
      alert('재택출근');

      const userEmail = window.sessionStorage.user_email;
      const userName = window.sessionStorage.user_name;
      const attendanceDate = moment().format('YYYY MM월 DD일, HH:mm:ss');

      // 로그인 사용자의 id를 조회해 팀 값을 결정
      let team = '';
      for (let i = 0; i < teamData.length; i++) {
        if (teamData[i].key === userEmail) {
          team = teamData[i].team;
        }
      }

      const sheetId = moment().format('YYYY-MM-DD');

      try {
        // 기존 데이터가 있으면 해당 index에, 없으면 마지막 index에 추가
        // 해당 유저의 row가 이미 있으면 그 row를 수정
        // 그게 아니면 row index에 값을 새로 쓴다.
        const index = checkInOut.data?.index ?? checkInOut.lastIndex;
        await trackPromise(
          window.gapi.client.sheets.spreadsheets.values.batchUpdate({
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
                    userEmail,
                    '재택',
                  ],
                ],
              },
            ],
          })
        );

        // 네트워크 요청을 보장
        const res = new Response();
        if (res.status === 200) {
          trackPromise(
            loadTodaySheet().then((res: any) => {
              dispatch(fetchRequestToUpdate(converToState(res)));
            })
          );
          trackPromise(
            getSheet(sheetId).then((sheet) => {
              dispatch(fetchRequest(converToState(sheet)));
            })
          );
        }
      } catch (err) {
        console.log('error:', err);
      }
    } else {
      alert('취소');
    }
  };

  // 회사 출근 버튼
  const companyWork = async () => {
    const CHECKIN_ALERT = window.confirm('회사 출근하시겠습니까?');
    if (CHECKIN_ALERT) {
      alert('회사출근');

      const userEmail = window.sessionStorage.user_email;
      const userName = window.sessionStorage.user_name;
      const attendanceDate = moment().format('YYYY MM월 DD일, HH:mm:ss');

      let team = '';
      for (let i = 0; i < teamData.length; i++) {
        if (teamData[i].key === userEmail) {
          team = teamData[i].team;
        }
      }

      const sheetId = moment().format('YYYY-MM-DD');

      try {
        const index = checkInOut.data?.index ?? checkInOut.lastIndex;
        await trackPromise(
          window.gapi.client.sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: '1MCnYjLcdHg7Vu9GUSiOwWxSLDTK__PzNod5mCLnVIwQ',
            valueInputOption: 'USER_ENTERED',
            data: [
              {
                range: `'${sheetId}'!A${index}:H${index}`,
                values: [
                  [
                    team,
                    userName,
                    attendanceDate,
                    '',
                    '',
                    '근무미달',
                    userEmail,
                    '회사',
                  ],
                ],
              },
            ],
          })
        );

        const res = new Response();
        if (res.status === 200) {
          trackPromise(
            loadTodaySheet().then((res: any) => {
              dispatch(fetchRequestToUpdate(converToState(res)));
            })
          );
          trackPromise(
            getSheet(sheetId).then((sheet) => {
              dispatch(fetchRequest(converToState(sheet)));
            })
          );
        }
      } catch (err) {
        console.log('error:', err);
      }
    } else {
      alert('취소');
    }
  };

  // 재택 퇴근
  const reverseDisable = async () => {
    if (checkInOut.data?.homeWork === '재택') {
      confirmAlert({
        title: `현재 재택 퇴근입니다.`,
        message: '퇴근환경을 변경하시려면 변경을 눌러주세요',
        buttons: [
          {
            label: '변경',
            onClick: async () => {
              // moment 연산을 위한 변수 재지정
              let leaveDate = moment(new Date());
              const userEmail = window.sessionStorage.user_email;
              const leaveDateFormat = leaveDate.format(
                'YYYY MM월 DD일, HH:mm:ss'
              );

              // 퇴근시간 - 출근시간
              const subtractTime = moment(
                leaveDate,
                'YYYY MM월 DD일, HH:mm:ss'
              ).diff(
                moment(checkInOut.data?.checkIn, 'YYYY MM월 DD일, HH:mm:ss')
              );

              // 시간차이
              const momentDuration = moment.duration(subtractTime);
              const time =
                Math.floor(momentDuration.asHours()) +
                ' 시간' +
                moment.utc(subtractTime).format(' mm 분 ss 초');

              // 시간으로만 근무상태를 판별하기 위한 변수
              const workHours = Math.floor(momentDuration.asHours());
              const workState =
                workHours >= 9
                  ? '정상'
                  : workHours < 9
                  ? '근무미달'
                  : '근무상태 오류';

              window.localStorage.setItem('user_workState', '회사');

              // 출근 날짜와 퇴근 날짜가 다르면 퇴근 날짜를 23시 59분 59초로 설정
              // toDate = moment 객체를 날짜 객체로 변환
              if (
                moment(checkInOut.data?.checkIn, 'YYYY MM월 DD일, HH:mm:ss')
                  .toDate()
                  .getDate() !== leaveDate.toDate().getDate()
              ) {
                const date = moment(
                  checkInOut.data?.checkIn,
                  'YYYY MM월 DD일, HH:mm:ss'
                ).toDate();
                date.setHours(23);
                date.setMinutes(59);
                date.setSeconds(59);
                leaveDate = moment(date);
              }

              const sheetId = moment().format('YYYY-MM-DD');
              try {
                const index = checkInOut.data?.index ?? checkInOut.lastIndex;
                await trackPromise(
                  window.gapi.client.sheets.spreadsheets.values.batchUpdate({
                    spreadsheetId:
                      '1MCnYjLcdHg7Vu9GUSiOwWxSLDTK__PzNod5mCLnVIwQ',
                    valueInputOption: 'USER_ENTERED',
                    data: [
                      {
                        // 오늘 시트의 D index 번째 컬럼부터 H index 번째 컬럼까지 데이터를 채움
                        range: `'${sheetId}'!D${index}:H${index}`,
                        values: [
                          [leaveDateFormat, time, workState, userEmail, '회사'],
                        ],
                      },
                    ],
                  })
                );

                const res = new Response();
                if (res.status === 200) {
                  trackPromise(
                    loadTodaySheet().then((res: any) => {
                      dispatch(fetchRequestToUpdate(converToState(res)));
                    })
                  );
                  trackPromise(
                    getSheet(sheetId).then((sheet) => {
                      dispatch(fetchRequest(converToState(sheet)));
                    })
                  );
                }
              } catch (err) {
                console.log('error:', err);
              }
            },
          },
          {
            label: '변경안함',
            onClick: async () => {
              let leaveDate = moment(new Date());
              const userEmail = window.sessionStorage.user_email;
              const leaveDateFormat = leaveDate.format(
                'YYYY MM월 DD일, HH:mm:ss'
              );
              const subtractTime = moment(
                leaveDate,
                'YYYY MM월 DD일, HH:mm:ss'
              ).diff(
                moment(checkInOut.data?.checkIn, 'YYYY MM월 DD일, HH:mm:ss')
              );
              const momentDuration = moment.duration(subtractTime);
              const time =
                Math.floor(momentDuration.asHours()) +
                ' 시간' +
                moment.utc(subtractTime).format(' mm 분 ss 초');
              const workHours = Math.floor(momentDuration.asHours());

              window.localStorage.setItem('user_workState', '재택');

              if (
                moment(checkInOut.data?.checkIn, 'YYYY MM월 DD일, HH:mm:ss')
                  .toDate()
                  .getDate() !== leaveDate.toDate().getDate()
              ) {
                const date = moment(
                  checkInOut.data?.checkIn,
                  'YYYY MM월 DD일, HH:mm:ss'
                ).toDate();
                date.setHours(23);
                date.setMinutes(59);
                date.setSeconds(59);
                leaveDate = moment(date);
              }

              const workState =
                workHours >= 9
                  ? '정상'
                  : workHours < 9
                  ? '근무미달'
                  : '근무상태 오류';
              const sheetId = moment().format('YYYY-MM-DD');
              try {
                const index = checkInOut.data?.index ?? checkInOut.lastIndex;
                await trackPromise(
                  window.gapi.client.sheets.spreadsheets.values.batchUpdate({
                    spreadsheetId:
                      '1MCnYjLcdHg7Vu9GUSiOwWxSLDTK__PzNod5mCLnVIwQ',
                    valueInputOption: 'USER_ENTERED',
                    data: [
                      {
                        range: `'${sheetId}'!D${index}:H${index}`,
                        values: [
                          [leaveDateFormat, time, workState, userEmail, '재택'],
                        ],
                      },
                    ],
                  })
                );

                const res = new Response();
                if (res.status === 200) {
                  trackPromise(
                    loadTodaySheet().then((res: any) => {
                      dispatch(fetchRequestToUpdate(converToState(res)));
                    })
                  );
                  trackPromise(
                    getSheet(sheetId).then((sheet) => {
                      dispatch(fetchRequest(converToState(sheet)));
                    })
                  );
                }
              } catch (err) {
                console.log('error:', err);
              }
            },
          },
        ],
      });
    }

    // 회사 퇴근
    else if (checkInOut.data?.homeWork === '회사') {
      confirmAlert({
        title: `현재 회사 퇴근입니다.`,
        message: '퇴근환경을 변경하시려면 변경을 눌러주세요',
        buttons: [
          {
            label: '변경',
            onClick: async () => {
              let leaveDate = moment(new Date());
              const userEmail = window.sessionStorage.user_email;
              const leaveDateFormat = leaveDate.format(
                'YYYY MM월 DD일, HH:mm:ss'
              );
              const subtractTime = moment(
                leaveDate,
                'YYYY MM월 DD일, HH:mm:ss'
              ).diff(
                moment(checkInOut.data?.checkIn, 'YYYY MM월 DD일, HH:mm:ss')
              );
              const momentDuration = moment.duration(subtractTime);
              const time =
                Math.floor(momentDuration.asHours()) +
                ' 시간' +
                moment.utc(subtractTime).format(' mm 분 ss 초');
              const workHours = Math.floor(momentDuration.asHours());
              const workState =
                workHours >= 9
                  ? '정상'
                  : workHours < 9
                  ? '근무미달'
                  : '근무상태 오류';

              window.localStorage.setItem('user_workState', '재택');

              if (
                moment(checkInOut.data?.checkIn, 'YYYY MM월 DD일, HH:mm:ss')
                  .toDate()
                  .getDate() !== leaveDate.toDate().getDate()
              ) {
                const date = moment(
                  checkInOut.data?.checkIn,
                  'YYYY MM월 DD일, HH:mm:ss'
                ).toDate();
                date.setHours(23);
                date.setMinutes(59);
                date.setSeconds(59);
                leaveDate = moment(date);
              }

              const sheetId = moment().format('YYYY-MM-DD');
              try {
                const index = checkInOut.data?.index ?? checkInOut.lastIndex;
                await trackPromise(
                  window.gapi.client.sheets.spreadsheets.values.batchUpdate({
                    spreadsheetId:
                      '1MCnYjLcdHg7Vu9GUSiOwWxSLDTK__PzNod5mCLnVIwQ',
                    valueInputOption: 'USER_ENTERED',
                    data: [
                      {
                        range: `'${sheetId}'!D${index}:H${index}`,
                        values: [
                          [leaveDateFormat, time, workState, userEmail, '재택'],
                        ],
                      },
                    ],
                  })
                );

                const res = new Response();
                if (res.status === 200) {
                  trackPromise(
                    loadTodaySheet().then((res: any) => {
                      dispatch(fetchRequestToUpdate(converToState(res)));
                    })
                  );
                  trackPromise(
                    getSheet(sheetId).then((sheet) => {
                      dispatch(fetchRequest(converToState(sheet)));
                    })
                  );
                }
              } catch (err) {
                console.log('error:', err);
              }
            },
          },
          {
            label: '변경안함',
            onClick: async () => {
              let leaveDate = moment(new Date());
              const userEmail = window.sessionStorage.user_email;
              const leaveDateFormat = leaveDate.format(
                'YYYY MM월 DD일, HH:mm:ss'
              );
              const subtractTime = moment(
                leaveDate,
                'YYYY MM월 DD일, HH:mm:ss'
              ).diff(
                moment(checkInOut.data?.checkIn, 'YYYY MM월 DD일, HH:mm:ss')
              );
              const momentDuration = moment.duration(subtractTime);
              const time =
                Math.floor(momentDuration.asHours()) +
                ' 시간' +
                moment.utc(subtractTime).format(' mm 분 ss 초');
              const workHours = Math.floor(momentDuration.asHours());
              const workState =
                workHours >= 9
                  ? '정상'
                  : workHours < 9
                  ? '근무미달'
                  : '근무상태 오류';

              window.localStorage.setItem('user_workState', '회사');

              if (
                moment(checkInOut.data?.checkIn, 'YYYY MM월 DD일, HH:mm:ss')
                  .toDate()
                  .getDate() !== leaveDate.toDate().getDate()
              ) {
                const date = moment(
                  checkInOut.data?.checkIn,
                  'YYYY MM월 DD일, HH:mm:ss'
                ).toDate();
                date.setHours(23);
                date.setMinutes(59);
                date.setSeconds(59);
                leaveDate = moment(date);
              }

              const sheetId = moment().format('YYYY-MM-DD');
              try {
                const index = checkInOut.data?.index ?? checkInOut.lastIndex;
                await trackPromise(
                  window.gapi.client.sheets.spreadsheets.values.batchUpdate({
                    spreadsheetId:
                      '1MCnYjLcdHg7Vu9GUSiOwWxSLDTK__PzNod5mCLnVIwQ',
                    valueInputOption: 'USER_ENTERED',
                    data: [
                      {
                        range: `'${sheetId}'!D${index}:H${index}`,
                        values: [
                          [leaveDateFormat, time, workState, userEmail, '회사'],
                        ],
                      },
                    ],
                  })
                );

                const res = new Response();
                if (res.status === 200) {
                  trackPromise(
                    loadTodaySheet().then((res: any) => {
                      dispatch(fetchRequestToUpdate(converToState(res)));
                    })
                  );
                  trackPromise(
                    getSheet(sheetId).then((sheet) => {
                      dispatch(fetchRequest(converToState(sheet)));
                    })
                  );
                }
              } catch (err) {
                console.log('error:', err);
              }
            },
          },
        ],
      });
    }
  };

  return (
    <div>
      <Container>
        <Button
          type="primary"
          disabled={checkInButtonDisaled}
          onClick={btnDisable}
        >
          재택
        </Button>
      </Container>
      <Container id="180px">
        <Button
          type="primary"
          disabled={companyWorkButtonDisaled}
          onClick={companyWork}
        >
          회사
        </Button>
      </Container>
      <Container id="80px">
        <Button
          type="primary"
          disabled={checkOutButtonDisabled}
          onClick={reverseDisable}
        >
          퇴근
        </Button>
      </Container>
    </div>
  );
};

export default React.memo(UserButton);
