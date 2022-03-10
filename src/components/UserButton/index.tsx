import React from 'react';
import 'antd/dist/antd.css';
import styled from "styled-components";
import { Button } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { checkInAction, checkOutAction } from '../../store/inventory/action';

const Container = styled.div`
    position: fixed;
    right: 80px;
`;

const Container2 = styled.div`
    position: fixed;
    right: 10px;
`;

const UserButton = (_props: any) => {

    // const [inputData, setInputData] = useState({
    //     team: '',
    //     user: '',
    //     checkIn: '',
    //     checkOut: '',
    //     workTime: '',
    //     workState: '',
    //     homeWork: ''
    // });
    
    
    const [disable, setDisable] = useState(false);

    const dispatch = useDispatch();
    const dispatch2 = useDispatch();
    
    const btnDisable = () => {
        setDisable(true)
        // 데이터 삽입을 위한 format 
        const newDate = moment(new Date()).format('YYYY DD월 MM일,HH:mm:ss');
        console.log('출근시간',newDate)
        dispatch(checkInAction(newDate))
    }

    const reverseDisable = () => {
        setDisable(false)
        const newDate = moment(new Date()).format('YYYY DD월 MM일,HH:mm:ss');
        console.log('퇴근시간',newDate)
        dispatch2(checkOutAction(newDate))
    }
    
    // const handleSubmit = async (e:any) => {
    //     try{
    //         const res = await fetch(
    //             "https://api.apispreadsheets.com/data/yjcil7KcW6fzFcJF/", {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                 body: JSON.stringify({"data": {
    //                         "team": inputData.team, "user": inputData.user, "checkIn": inputData.checkIn, "checkOut": inputData.checkOut,
    //                         "workTime": inputData.workTime, "workState": inputData.workState, "homeWork": inputData.homeWork
    //                     }
    //                 })
    //             }
    //         );
    //         await res.json();
    //         setInputData({...inputData, team:"",user:"",checkIn:"",checkOut:"",workTime:"",workState:"",homeWork:""})
    //     } catch(err){
    //         console.log('error:',  err);
    //     }
    // }

    return (
        <div>
            <Container>
                <Button type="primary" disabled={disable} onClick={btnDisable}>출근</Button>
            </Container>
            <Container2>
                <Button type="primary" disabled={!disable} onClick={reverseDisable}>퇴근</Button>
            </Container2>
        </div>
    );
};

export default UserButton;