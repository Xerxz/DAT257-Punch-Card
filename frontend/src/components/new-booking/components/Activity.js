import React, { useState, useEffect } from 'react';
import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import 'primeflex/primeflex.css';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

var daily = true;

export default function Activity(props) {

    const activityInfo = props.activityInfo;

    const [activity, setActivity] = useState(null);
    const [startDate, setStartDate] = useState(moment());
    const [endDate, setEndDate] = useState(moment());
    const [focused, setFocused] = useState(null);
    const [minutes, setMinutes] = useState();
    const [hours, setHours] = useState();
    const [startDateTime, setStartDateTime] = useState(new Date());


    const startDateId = uuidv4();
    const endDateId = uuidv4();

    const setSelectedActivity = (value) => {
        daily = value.daily;
        setActivity(value);
    }

    const getDateSelect = () => {
        if (daily === false) {
            return (
                <DateRangePicker
                    startDate={startDate}
                    startDateId={startDateId}
                    endDate={endDate}
                    endDateId={endDateId}
                    onDatesChange={({ startDate, endDate }) => {
                        setStartDate(startDate);
                        setEndDate(endDate);
                    }}
                    readOnly={true}
                    focusedInput={focused}
                    onFocusChange={focusedInput => {
                        setFocused(focusedInput);
                    }}
                    numberOfMonths={1}
                />
            )
        } else if (daily === true) {
            return (
                <DatePicker
                    selected={startDateTime}
                    onChange={date => setStartDateTime(date)}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                />
            )
        }
    }

    return (
        <div className="p-fluid p-ai-center p-mx-5 p-mb-5">
            <div className="p-d-flex p-my-1 ">
                <span className="p-float-label" style={{ width: '85%' }}>
                    <Dropdown id="dropdown" optionLabel="name" options={activityInfo} value={activity} onChange={(e) => setSelectedActivity(e.value)} />
                    <label htmlFor="dropdown">Aktivitet</label>
                </span>
                <div className="p-ml-auto">
                    <Button className="p-button-raised p-button-danger" icon="pi pi-trash" iconPos="right" />
                </div>
            </div>
            <div className="p-mb-2">
                {getDateSelect()}
            </div>

        </div>

    )

}