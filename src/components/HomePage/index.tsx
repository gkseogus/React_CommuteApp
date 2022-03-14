import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Table } from 'antd';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../store';
import HomeDatePicker from '../DatePicker';
import UserButton from '../UserButton';
import UserSearch from '../UserSearch';
import { Moment } from 'moment';
import moment from 'moment';

const columns: any = [
  {
    title: '팀',
    dataIndex: 'team',
    filters: [
      {
        key: '1',
        text: 'GL',
        value: 'GL',
      },
      {
        key: '2',
        text: 'Visual',
        value: 'Visual',
      },
      {
        key: '3',
        text: 'Interaction',
        value: 'Interaction',
      },
      {
        key: '4',
        text: 'Motion',
        value: 'Motion',
      },
      {
        key: '5',
        text: 'I',
        value: 'I',
      },
      {
        key: '6',
        text: '전략기획',
        value: '전략기획',
      },
      {
        key: '7',
        text: 'WFE',
        value: 'WFE',
      },
      {
        key: '8',
        text: 'R&D',
        value: 'R&D',
      },
      {
        key: '9',
        text: 'PUB',
        value: 'PUB',
      },
      {
        key: '10',
        text: 'CM',
        value: 'CM',
      },      
      {
        key: '11',
        text: '경영지원',
        value: '경영지원'
      }
    ],
    // specify the condition of filtering result
    // here is that finding the name started with `value`
    onFilter: (value: any, record: { team: string | any[] }) =>
      record.team.indexOf(value) === 0,
  },
  {
    key: '21',
    title: '사용자',
    dataIndex: 'user',
    defaultSortOrder: 'user',
    sorter: (a: { user: number }, b: { user: number }): number =>
      a.user - b.user,
  },
  {
    key: '31',
    title: '체크인',
    dataIndex: 'checkIn',
    defaultSortOrder: 'checkIn',
    sorter: (a: { checkIn: number }, b: { checkIn: number }): number =>
      a.checkIn - b.checkIn,
  },
  {
    key: '41',
    title: '체크아웃',
    dataIndex: 'checkOut',
    defaultSortOrder: 'checkOut',
    sorter: (a: { checkOut: number }, b: { checkOut: number }): number =>
      a.checkOut - b.checkOut,
  },
  {
    key: '51',
    title: '근무시간',
    dataIndex: 'workTime',
    defaultSortOrder: 'workTime',
  },
  {
    key: '61',
    title: '근무상태',
    dataIndex: 'workState',
    filters: [
      {
        key: '62',
        text: '근무미달',
        value: '근무미달',
      },
      {
        key: '63',
        text: '정상',
        value: '정상',
      },
    ],
    onFilter: (value: any, record: { workState: string | any[] }) =>
      record.workState.indexOf(value) === 0,
  },
  {
    key: '71',
    title: '출근 여부',
    dataIndex: 'working',
    filters: [
      {
        key: '72',
        text: '출근',
        value: '출근',
      },
      {
        key: '73',
        text: '퇴근',
        value: '퇴근',
      },
    ],
    onFilter: (value: any, record: { working: string | any[] }) =>
      record.working.indexOf(value) === 0,
  },
];

const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
  console.log('params', pagination, filters, sorter, extra);
};

const HomePage = (_props: any) => {

  const [name, setName] = useState('');
  const [time, setTime] = useState<{ start: Moment; end: Moment }>();

  const newData = useSelector(
    (state: ApplicationState) => state.inventory.data
  );

  // 이름, 날짜로 필터링하는 로직 시작
  const data = (newData ?? [])
    // 이름이 입력됐을 경우 이름과 매칭하는 유저만 필터링 -> i = newData
    .filter((i) => (name ? i.user.includes(name) : true))
    .filter((i) => {
      // 시간 선택이 안되었을 때 모든 항목을 테이블에 보여줌
      if (!time) {
        return true;
      }

      /*
       * moment js 가 한글이 포함될 경우 파싱을 못하기 때문에 한글 제거 [.replace(/[가-핳]/g, '')]
       * 가나다라...처럼 조합된 한글을 찾는 표현식
       * checkIn, checkOut 값을 파싱 후
       * 선택한 영역에 포함하는지 검사 -> startOf('day') = day보다 작은 시,분,초를 제외시키기 위함
       */
      const checkIn = moment(
        String(i.checkIn).replace(/[가-핳]/g, ''),
        'YYYY M DD, hh:mm:ss'
      ).startOf('second');
      const checkOut = moment(
        String(i.checkOut).replace(/[가-핳]/g, ''),
        'YYYY M DD, hh:mm:ss'
      ).startOf('second');

      // 선택한 시간 범위에 checkIn 시간이 포함되거나
      // 선택한 시간 범위에 checkOut 시간이 포함되면
      // 해당 항목을 테이블에 보여줌
      return (
        (checkIn.isAfter(time.start) && checkIn.isBefore(time.end)) ||
        (checkOut.isAfter(time.start) && checkOut.isBefore(time.end))
      );
    });      


  // 이름, 날짜 필터링 적용을 위해서 UserButton, UserSearch 컴포넌트를 HomePage로 이동
  return (
    <div key={"HP"}>
      <UserButton />
      <HomeDatePicker
        onChange={(moment: Moment[]) =>
          // 시간이 선택되면 moment배열을 start,end프로퍼티로 담는다. 선택되지 않으면 undefined
          setTime(moment ? { start: moment[0], end: moment[1] } : undefined)
        }
      />
      <UserSearch onSearch={setName} />
      <Table columns={columns} dataSource={data} onChange={onChange} />
    </div>
  );
};

export default HomePage;
