import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import character from '../images/character.png';

const CalendarComponent = () => {
  const [events, setEvents] = useState([]); //이벤트 상태 정의 
  const [state,setState]=useState();
  const navigate = useNavigate(); //내비게이션 훅

  //-- 다이어리 데이터를 서버에서 가져오고, bool형식의 일기유무인 response를 받아 감자표시하는 함수 
  //연도와 월을 기준으로 서버에서 다이어리 데이터를 가져옴
  const fetchDiaries = async (year, month) => {
    
    try {
      // 서버에서 데이터 가져오기 (여기서는 mock 데이터 사용)
      const mockResponseData = {
        '2024-07-01':true, 
        '2024-07-25': true,
        '2024-07-26': true,
        '2024-07-27': true,
      };

      const daysInMonth = new Date(year, month, 0).getDate();  //해당 연도,월의 날짜수 반환
      const diaries = [];
      
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${String(year)}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (mockResponseData[dateStr]) {
          diaries.push({
            title: '', // 제목 비워둠
            start: dateStr,
            allDay: true,
            extendedProps: { imgSrc: character } // 이미지 URL 추가
          });
        }
      }

      setEvents(diaries); // 이벤트로 설정(react 상태 업데이트)
    } catch (error) {
      console.error('Error fetching diaries:', error);
    }
  };
  /*const fetchDiaries = async (year, month) => { 
    try { //api 생성 후 변경 
      const response = await axios.get('api명세서참고', {
        params: { year, month }
      });
  };*/


  // 시작날짜 설정
  useEffect(() => {
    const initialYear = today.getFullYear();
    const initialMonth = today.getMonth() + 1;
    fetchDiaries(initialYear, initialMonth);
  }, []);

  const handleDatesSet = (arg) => {
    const year = arg.start.getFullYear();
    const month = arg.start.getMonth() + 1;
    fetchDiaries(year, month);
  };


  // -- 버튼 클릭시 fetch함수 호출()
  // prev 버튼 클릭 핸들러
  const handlePrevClick = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    fetchDiaries(currentYear, currentMonth - 1);
  };

  // next 버튼 클릭 핸들러
  const handleNextClick = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    fetchDiaries(currentYear, currentMonth + 1);
  };

  // today 버튼 클릭 핸들러
  const handleTodayClick = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    fetchDiaries(currentYear, currentMonth);
  };

  // -- 날짜 클릭했을 때 일기기록에 따라 클릭했을 때 이동페이지 다르게 하는 함수 
  const handleDateClick = async (info) => {
    //테스트 데이터(일기유무 t/f)
    //const dateStr=info.event.startStr;
    const mockResponseData={
    '2024-07-01':true, 
    '2024-07-25':true,
    '2024-07-26':true,
    '2024-07-27':true,
    };
    const diaryExists=mockResponseData[info.dateStr]||false;
    console.log(info.dateStr,diaryExists);
    if (diaryExists){ 
      navigate(`/calender/${info.dateStr}`, { state: { date: info.dateStr, diary: true } });
    }else{
      navigate('/calender/modal', { state: { date: info.dateStr } });
    } 
  };

  /*
  const handleDateClick=async (info)=>{
    try {
      const response = await axios.get('api명세서참고', {
        params: { date: info.dateStr }
      });
  }*/

  const renderEventContent = (eventInfo) => {
    return (// 이벤트의 커스텀 콘텐츠를 렌더링. 이미지가 중앙에 배치되도록
      <EventContent>
        <EventImage src= {eventInfo.event.extendedProps.imgSrc}
         alt='potatostamp'
         onClick={()=>handleDateClick({dateStr:eventInfo.event.startStr})}/>
      </EventContent>
    );
  };

  return (
    <Container>
      <DefaultPotatoImage src={character} alt="감자 캐릭터" />
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate={formattedDate}
        navLinks={true}
        editable={true}
        dayMaxEvents={true}
        height={630}
        headerToolbar={{
          left: 'today',
          center: 'title',
          right: 'prev,next'
        }}
        customButtons={{
          prev: {
            text: 'prev',
            click: handlePrevClick,
          },
          next: {
            text: 'next',
            click: handleNextClick,
          },
          today: {
            text: 'today',
            click: handleTodayClick,
          },
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleDateClick}
        datesSet={handleDatesSet}
        eventContent={renderEventContent} // 이벤트 내용을 커스터마이즈
        eventDisplay='block'
      />
    </Container>
  );
};


export default CalendarComponent;


const Container = styled.div`
  width: 370px;
  height: 700px;
  margin: 0 auto;
  font-family: 'BMJua', Arial, sans-serif;
  .fc-day-sun a { color: red; text-decoration: none; }
  .fc-day-sat a { color: blue; text-decoration: none; }
  .fc a { font-size: 15px; }
  .fc { background-color: #F8F7EB; }
  .fc-toolbar-title { font-size: 30px; color: #000000; text-align: center; }
  .fc-view-harness, .fc-daygrid-day, .fc-scrollgrid-sync-inner, .fc-scrollgrid, .fc-daygrid-day-frame { border: none !important; }
  .fc-button { border: none; margin: 10px 1px 0px auto; font-size: 15px !important; padding: 2px 2px !important; }
  .fc-event { background-color: transparent !important; border: none !important; }
  `;

const EventContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const EventImage = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const today = new Date();
const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

const DefaultPotatoImage = styled.img`
  display: block;
  margin: 0px auto;
  width: 70px;
  height: auto;
`;
