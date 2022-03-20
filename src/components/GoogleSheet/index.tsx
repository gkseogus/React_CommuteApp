import moment from 'moment';

export const loadTodaySheet = async () => {
  const todayKey = moment().format('YYYY-MM-DD');
  // 오늘 날짜에 해당하는 시트를 조회
  const todaySheet = await getSheet(todayKey);
  if (todaySheet) {
    return todaySheet;
  }
  // 오늘 날짜에 해당하는 시트가 없는 경우 새로 생성
  await window.gapi.client.sheets.spreadsheets.batchUpdate(
    { spreadsheetId: '1MCnYjLcdHg7Vu9GUSiOwWxSLDTK__PzNod5mCLnVIwQ' },
    {
      requests: [
        {
          addSheet: {
            properties: { title: todayKey },
          },
        },
      ],
    }
  );
  return await getSheet(todayKey);
}

export const checkGapi = () => {
  return window.gapi.client != null;
}

export const getSheet = async (key: string) => {
  const res = await window.gapi.client.sheets.spreadsheets.get({
    spreadsheetId: '1MCnYjLcdHg7Vu9GUSiOwWxSLDTK__PzNod5mCLnVIwQ',
    ranges: [],
    // sheet 목록을 조회할 때 테이블 전체 데이터도 포함
    includeGridData: true,
  });
  // title과 Key 가 매칭되는 시트 찾기
  return res.result.sheets.find((sheet: any) => sheet.properties.title === key);
}

export const converToState = (sheet: any) => {
  const data = sheet?.data?.[0]?.rowData;
  if (!data) {
    return [];
  }
  return data.map((row: { values: { formattedValue: string }[] }) => ({
    key: row.values[7]?.formattedValue,
    team: row.values[0]?.formattedValue,
    user: row.values[1]?.formattedValue,
    checkIn: row.values[2]?.formattedValue,
    checkOut: row.values[3]?.formattedValue,
    workTime: row.values[4]?.formattedValue,
    workState: row.values[5]?.formattedValue,
    working: row.values[6]?.formattedValue,
  }));
}
