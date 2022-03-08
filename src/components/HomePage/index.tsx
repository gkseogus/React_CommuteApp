import React, { useEffect } from 'react';
import 'antd/dist/antd.css';
import { Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequest } from '../../store/inventory/action';
import { ApplicationState } from '../../store';
import { Inventory } from '../../store/inventory/types';

const columns:any = [
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
    onFilter: (value: any, record: { team: string | any[]; }) => record.team.indexOf(value) === 0,
  },
  {
    title: '사용자',
    dataIndex: 'user',
    defaultSortOrder: 'user',
    sorter: (a: { user: number; }, b: { user: number; }):number  => a.user - b.user,
  },
  {
    title: '체크인',
    dataIndex: 'checkIn',
    defaultSortOrder: 'checkIn',
    sorter: (a: { checkIn: number; }, b: { checkIn: number; }):number => a.checkIn - b.checkIn,
  },
  {
    title: '체크아웃',
    dataIndex: 'checkOut',
    defaultSortOrder: 'checkOut',
    sorter: (a: { checkOut: number; }, b: { checkOut: number; }):number  => a.checkOut - b.checkOut,
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
    onFilter: (value: any, record: { workState: string | any[]; }) => record.workState.indexOf(value) === 0,
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
    onFilter: (value: any, record: { homeWork: string | any[]; }) => record.homeWork.indexOf(value) === 0,
  },
];

const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
  console.log('params', pagination, filters, sorter, extra);
}

const HomePage = (_props: any) => {

  const dispatch = useDispatch()

  const getData = async () => {
    try{
        // fetch로 해당 API를 호출하고 응답 데이터를 받아옴(비동기 요청)
        const res = await fetch(
          "https://api.apispreadsheets.com/data/z6SgjWOFDfBTf3OL/"
        );
        // API를 호출한 후 응답 객체를 받으며 .json() 메서드로 파싱한 json값을 리턴
        const dataData = await res.json();
        console.log("API get data",dataData.data);
        dispatch(fetchRequest(dataData));
    } catch(err){
        console.log('error:', err);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const newData = useSelector((state: ApplicationState) => state.inventory.data );
  console.log('test', newData);

  const NEWW = (() => {
    console.log('test2', newData[0].team)
    if(!newData) return[];
    return [
      {
        key: "1",
        team: newData[0].team
      }
    ];
  })

  const data = [
    {
      key: 1,
      team: newData[0]?.team,
      user: '강부민',
      checkIn: 2222222,
      checkOut: 3333333,
      workTime: '11111111',
      workState: '근무미달',
      homeWork: '회사',
    },
    {
      key: 2,
      team: 'Visual',
      user: '김진홍',
      checkIn: 222,
      checkOut: 3333323333,
      workTime: '44',
      workState: '정상',
      homeWork: '재택',
    }
  ];

  return (
      <Table
        columns={columns}
        dataSource={data} 
        onChange={onChange}
      />
  );
}

export default HomePage;