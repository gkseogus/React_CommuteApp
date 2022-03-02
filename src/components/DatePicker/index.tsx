import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import styled from "styled-components";

const SectionTitle = styled.div`
  height: 100%;
  width: 100%; 
  padding: 20px;
  background: red;
`;


type AllProps = any;
const DatePickerComponent: React.FC<AllProps> = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startDat1e, setStartDate1] = useState(new Date());

  return (
      <SectionTitle>
        <DatePicker 
          selected={startDate} 
          onChange={(date:Date) => setStartDate(date)} 
          selectsStart
          startDate={startDate}
          endDate={endDate}
        />
        <DatePicker 
          selected={endDate} 
          onChange={(date:Date) => setEndDate(date)} 
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
        />
        <DatePicker
          selected={startDat1e}
          onChange={(date:Date) => setStartDate1(date)}
          isClearable
          placeholderText="I have been cleared!"
        />
      </SectionTitle>
  );
};


export default DatePickerComponent ;
