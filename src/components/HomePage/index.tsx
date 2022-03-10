import { Table } from 'antd';
import 'antd/dist/antd.css';
import moment, { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../../store';
import { fetchRequest } from '../../store/inventory/action';
import HomeDatePicker from '../DatePicker';
import UserButton from '../UserButton';
import UserSearch from '../UserSearch';

const columns: any = [
  {
    title: '팀',
    dataIndex: 'team',
    filters: [
      {
        text: 'GL',
        value: 'GL',
      },
      {
        text: 'Visual',
        value: 'Visual',
      },
      {
        text: 'Interaction',
        value: 'Interaction',
      },
      {
        text: 'Motion',
        value: 'Motion',
      },
      {
        text: 'I',
        value: 'I',
      },
      {
        text: '전략기획',
        value: '전략기획',
      },
      {
        text: 'WFE',
        value: 'WFE',
      },
      {
        text: 'R&D',
        value: 'R&D',
      },
    ],
    // specify the condition of filtering result
    // here is that finding the name started with `value`
    onFilter: (value: any, record: { team: string | any[] }) =>
      record.team.indexOf(value) === 0,
  },
  {
    title: '사용자',
    dataIndex: 'user',
    defaultSortOrder: 'user',
    sorter: (a: { user: number }, b: { user: number }): number =>
      a.user - b.user,
  },
  {
    title: '체크인',
    dataIndex: 'checkIn',
    defaultSortOrder: 'checkIn',
    sorter: (a: { checkIn: number }, b: { checkIn: number }): number =>
      a.checkIn - b.checkIn,
  },
  {
    title: '체크아웃',
    dataIndex: 'checkOut',
    defaultSortOrder: 'checkOut',
    sorter: (a: { checkOut: number }, b: { checkOut: number }): number =>
      a.checkOut - b.checkOut,
  },
  {
    title: '근무시간',
    dataIndex: 'workTime',
    defaultSortOrder: 'workTime',
  },
  {
    title: '근무상태',
    dataIndex: 'workState',
    filters: [
      {
        text: '근무미달',
        value: '근무미달',
      },
      {
        text: '정상',
        value: '정상',
      },
    ],
    onFilter: (value: any, record: { workState: string | any[] }) =>
      record.workState.indexOf(value) === 0,
  },
  {
    title: '출근 상태',
    dataIndex: 'homeWork',
    filters: [
      {
        text: '출근',
        value: '출근',
      },
      {
        text: '퇴근',
        value: '퇴근',
      },
    ],
    onFilter: (value: any, record: { homeWork: string | any[] }) =>
      record.homeWork.indexOf(value) === 0,
  },
];

const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
  console.log('params', pagination, filters, sorter, extra);
};

const HomePage = (_props: any) => {
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      // fetch로 해당 API를 호출하고 응답 데이터를 받아옴(비동기 요청)
      const res = await fetch(
        'https://api.apispreadsheets.com/data/yjcil7KcW6fzFcJF/'
      );
      // API를 호출한 후 응답 객체를 받으며 .json() 메서드로 파싱한 json값을 리턴
      const dataData = await res.json();
      console.log('API get data', dataData.data);
      dispatch(fetchRequest(dataData.data));
    } catch (err) {
      console.log('error:', err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const [name, setName] = useState('');
  const [time, setTime] = useState<{ start: Moment; end: Moment }>();

  const newData = useSelector(
    (state: ApplicationState) => state.inventory.data
  );

  // 이름, 날짜로 필터링하는 로직 시작
  const data = (newData ?? [])
    // 이름이 입력됐을 경우 이름과 매칭하는 유저만 필터링
    .filter((i) => (name ? i.user.includes(name) : true))
    .filter((i) => {
      if (!time) {
        return true;
      }
      /**
       * moment js 가 한글이 포함될 경우 파싱을 못하기 때문에 한글 제거 [.replace(/[가-핳]/g, '')]
       * checkIn, checkOut 값을 파싱 후
       * 선택한 영역에 포함하는지 검사
       */
      const start = time.start.startOf('day');
      const end = time.end.startOf('day');

      const checkIn = moment(
        String(i.checkIn).replace(/[가-핳]/g, ''),
        'YYYY M DD, hh:mm:ss'
      ).startOf('day');
      
      const checkOut = moment(
        String(i.checkOut).replace(/[가-핳]/g, ''),
        'YYYY M DD, hh:mm:ss'
      ).startOf('day');
      return (
        (checkIn.isAfter(start) || checkIn.isSame(start)) &&
        (checkOut.isBefore(end) || checkOut.isSame(end))
      );
    });

  // 이름, 날짜 필터링 적용을 위해서 UserButton, UserSearch 컴포넌트를 HomePage로 이동
  return (
    <div>
      <UserButton />
      <HomeDatePicker
        onChange={(moment: Moment[]) =>
          setTime(moment ? { start: moment[0], end: moment[1] } : undefined)
        }
      />
      <UserSearch onSearch={setName} />
      <Table columns={columns} dataSource={data} onChange={onChange} />
    </div>
  );
};

export default HomePage;
