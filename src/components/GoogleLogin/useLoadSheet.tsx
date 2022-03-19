import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { fetchRequest } from '../../store/inventory/action';

export const useLoadSheet = () => {
  const dispatch = useDispatch();
  return useCallback((sheet) => {
    if (sheet == null) {
      dispatch(fetchRequest([]));
      return;
    }
    dispatch(
      fetchRequest(
        sheet.data[0].rowData.map(
          (row: { values: { formattedValue: string }[] }) => ({
            key: row.values[7].formattedValue,
            team: row.values[0].formattedValue,
            user: row.values[1].formattedValue,
            checkIn: row.values[2].formattedValue,
            checkOut: row.values[3].formattedValue,
            workTime: row.values[4].formattedValue,
            workState: row.values[5].formattedValue,
            working: row.values[6].formattedValue,
          })
        )
      )
    );
  }, [dispatch]);
}
