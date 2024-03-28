import React from 'react';
import '../styles/Calendar.css';

function Calendar() {
    return (
        <div className='Calender_div'>
            <div className='package_div'>
                <ul>
                    <li>Package Name</li>
                    <li>Invoice date</li>
                    <li>Status</li>
                    <li>Actions</li>
                </ul>

                <ul className='package_index_div'>
                    <li>시간대절 리마인드 (TIME)</li>
                    <li>every day 18:00</li>
                    <li>Running</li>
                    <li>Actions</li>
                </ul>

                <ul className='package_index_div'>
                    <li>시간대절 리마인드 (TIME)</li>
                    <li>every day 18:00</li>
                    <li>Running</li>
                    <li>Actions</li>
                </ul>

                <ul className='package_index_div'>
                    <li>시간대절 리마인드 (TIME)</li>
                    <li>every day 18:00</li>
                    <li>Running</li>
                    <li>Actions</li>
                </ul>

                <ul className='package_index_div'>
                    <li>시간대절 리마인드 (TIME)</li>
                    <li>every day 18:00</li>
                    <li>Running</li>
                    <li>Actions</li>
                </ul>

                <ul className='package_index_div'>
                    <li>시간대절 리마인드 (TIME)</li>
                    <li>every day 18:00</li>
                    <li>Running</li>
                    <li>Actions</li>
                </ul>

            </div>

            <div className='information_div'>
                <ul>
                    <li>Personal Information</li>
                    <li>
                        <ul>
                            <li>Package Name</li>
                            <li>Invoice date</li>
                        </ul>
                    </li>
                    <li>
                        <ul>
                            <li><input type='text'/></li>
                            <li><input type='text'/></li>
                        </ul>
                    </li>
                    <li>Google Spreadsheet Address</li>
                    <li><input type='text'/></li>
                    <li>Start comment</li>
                    <li><input type='text'/></li>
                    <li>BIO</li>
                    <li><textarea/></li>
                    <li>
                        <button>Cancle</button>
                        <button>Save</button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Calendar;