import { Table } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ApplicationState } from '../../store';
import { fetchRequest } from '../../store/inventory/action';
import HomeDatePicker from '../DatePicker';
import { checkGapi, converToState, getSheet } from '../GoogleSheet';
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
      {
        text: 'PUB',
        value: 'PUB',
      },
      {
        text: 'CM',
        value: 'CM',
      },
      {
        text: '경영지원',
        value: '경영지원',
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
    sorter: (a: { user: string }, b: { user: string }) => {
      // 삼항연산자, a<b이면 1, elseIf(a===b)이면 0, else이면 -1
      return a < b ? 1 : a === b ? 0 : -1;
    },
  },
  {
    title: '체크인',
    dataIndex: 'checkIn',
    defaultSortOrder: 'checkIn',
    sorter: (a: { checkIn: string }, b: { checkIn: string }) => {
      return a.checkIn < b.checkIn ? 1 : a.checkIn === b.checkIn ? 0 : -1;
    },
  },
  {
    title: '체크아웃',
    dataIndex: 'checkOut',
    defaultSortOrder: 'checkOut',
    sorter: (a: { checkIn: string }, b: { checkIn: string }) => {
      return a.checkIn < b.checkIn ? 1 : a.checkIn === b.checkIn ? 0 : -1;
    },
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
    title: '재택 여부',
    dataIndex: 'homeWork',
    filters: [
      {
        text: '회사',
        value: '회사',
      },
      {
        text: '재택',
        value: '재택',
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
  const [name, setName] = useState('');
  const [time, setTime] = useState<Moment>();
  const history = useHistory();
  const dispatch = useDispatch();

  const rootData = useSelector(
    (state: ApplicationState) => state.inventory.update
  );

  const targetData = useSelector(
    (state: ApplicationState) => state.inventory.data
  )
  
  useEffect(() => {
    if(window.sessionStorage.length === 0){
      history.push('/login');
    }

    // 스프레드 시트 api 가 로드되지 않았으면 Skip
    if (!checkGapi()) {
      return;
    }
    // 날짜를 선택하지 않을 경우
    if (!time) {
      const todayKey = moment().format('YYYY-MM-DD');
      getSheet(todayKey).then((sheet) => {
        dispatch(fetchRequest(converToState(sheet)));
      });
    }

    // 날짜를 선택할 경우
    else {
      const sheetKey = time.format('YYYY-MM-DD');
      getSheet(sheetKey).then((sheet) => {
        dispatch(fetchRequest(converToState(sheet)));
      });
    }
  }, [dispatch, history, time]);

  // 지난 날짜, 현재 날짜에 대한 유저 검색
  // targetData는 지난 날짜 데이터를 보여주는 상태값
  const data = (targetData ?? rootData).filter(
    (i) => !name || i.user.includes(name)
  );

  // 이름, 날짜 필터링 적용을 위해서 UserButton, UserSearch 컴포넌트를 HomePage로 이동
  return (
    <div key={'HP'}>
      <UserButton />
      <HomeDatePicker
        onChange={(moment: Moment) =>
          // 날짜가 선택되면 
          setTime(moment)
        }
      />
      <UserSearch onSearch={setName} />
      <Table columns={columns} dataSource={data} onChange={onChange} />
    </div>
  );
};

export default React.memo(HomePage);
