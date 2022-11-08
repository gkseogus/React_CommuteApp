import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import { Moment } from 'moment';
import { trackPromise } from 'react-promise-tracker';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Inventory } from '../../store/inventory/types';
import { ApplicationState } from '../../store';
import { fetchRequest } from '../../store/inventory/action';
import HomeDatePicker from '../HomeDatePicker';
import { checkGapi, converToState, getSheet } from '../GoogleSheet';
import UserButton from '../UserButton';
import UserSearch from '../UserSearch';

interface FiltersFace {
  text: string;
  value: string;
}

interface ColumnsFace {
  title: string;
  dataIndex: string;
  defaultSortOrder: string;
  filters: FiltersFace[];
}

/** Columns option */
const columns: ColumnsFace[] | any = [
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
    onFilter: (value: string, record: { team: string | string[] }): boolean => {
      return record.team.indexOf(value) === 0;
    },
  },
  {
    title: '사용자',
    dataIndex: 'user',
    defaultSortOrder: 'user',
    sorter: (a: { user: string }, b: { user: string }): number => {
      return a < b ? 1 : a === b ? 0 : -1;
    },
  },
  {
    title: '체크인',
    dataIndex: 'checkIn',
    defaultSortOrder: 'checkIn',
    sorter: (a: { checkIn: string }, b: { checkIn: string }): number => {
      return a.checkIn < b.checkIn ? 1 : a.checkIn === b.checkIn ? 0 : -1;
    },
  },
  {
    title: '체크아웃',
    dataIndex: 'checkOut',
    defaultSortOrder: 'checkOut',
    sorter: (a: { checkIn: string }, b: { checkIn: string }): number => {
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
    onFilter: (
      value: string,
      record: { workState: string | string[] }
    ): boolean => record.workState.indexOf(value) === 0,
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
    onFilter: (
      value: string,
      record: { homeWork: string | string[] }
    ): boolean => record.homeWork.indexOf(value) === 0,
  },
];

const HomePage = (_props: any) => {
  const [name, setName] = useState<string>('');
  const [time, setTime] = useState<Moment>();
  const history = useNavigate();
  const dispatch = useDispatch();

  const rootData: Inventory[] = useSelector(
    (state: ApplicationState) => state.inventory.update
  );

  const targetData: Inventory[] = useSelector(
    (state: ApplicationState) => state.inventory.data
  );

  /** Search for users in the past and current dates */
  const data: Inventory[] = (targetData ?? rootData).filter(
    (i) => !name || i.user.includes(name)
  );

  useEffect(() => {
    /** Skip if spreadsheet api is not loaded */
    if (!checkGapi()) {
      return;
    }

    /** If you don't select the date */
    if (!time) {
      const todayKey: string = moment().format('YYYY-MM-DD');
      trackPromise(
        getSheet(todayKey).then((sheet: string) => {
          dispatch(fetchRequest(converToState(sheet)));
        })
      );
    } else {
      /** If you select a date */
      const sheetKey: string = time.format('YYYY-MM-DD');
      trackPromise(
        getSheet(sheetKey).then((sheet: string) => {
          dispatch(fetchRequest(converToState(sheet)));
        })
      );
    }
  }, [dispatch, history, time]);

  return (
    <div>
      <UserButton />
      <HomeDatePicker onChange={(moment: Moment) => setTime(moment)} />
      <UserSearch onSearch={setName} />
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default React.memo(HomePage);
