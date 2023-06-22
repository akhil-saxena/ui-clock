import React, { useEffect, useState } from 'react';
import { useGesture } from 'react-use-gesture'
import './Clock.css';

export default function Clock() {

    const [time, setTime] = useState(new Date());
    const [editedTime, setEditedTime] = useState(time);


    useEffect(() => {
        const timerId = setInterval(() => {
            setTime((prevTime) => {
                const newTime = new Date(prevTime.getTime());
                newTime.setSeconds(newTime.getSeconds() + 1);
                return newTime;
            });
        }, 1000);

        return () => { clearInterval(timerId); };
    }, []);

    useEffect(() => {
        setEditedTime(time);
    }, [time])

    const handleDrag = (type, delta) => {
        const newTime = new Date(time.getTime());
        if (type === 'minutes') {
            const newMinutes = newTime.getMinutes() + delta;
            newTime.setMinutes(Math.max(0, Math.min(59, newMinutes)));
        }
        else if (type === 'seconds') {
            const newSeconds = newTime.getSeconds() + delta;
            newTime.setMinutes(Math.max(0, Math.min(59, newSeconds)));
        }

        setTime(newTime);
        setEditedTime(newTime);
    };

    const bindMinutes = useGesture({ onDrag: ({ movement: [_, y] }) => handleDrag('minutes', y / 6) });
    const bindSeconds = useGesture({ onDrag: ({ movement: [_, y] }) => handleDrag('seconds', y / 6) });

    const minuteRotation = (time.getMinutes() + time.getSeconds() / 60) * 6;
    const secondRotation = (time.getSeconds() + time.getMilliseconds() / 1000) * 6;

    const numbers = Array.from({
        length: 12
    }, (_, index) => index + 1)

    const handleInputChange = (event) => {
        const { value } = event.target;
        const [minuteStr, secondsStr] = value.split(":");
        const minutes = parseInt(minuteStr);
        const seconds = parseInt(secondsStr);

        if (!isNaN(minutes) && !isNaN(seconds)) {
            const newTime = new Date(time.getTime());
            newTime.setMinutes(Math.max(0, Math.min(59, minutes)));
            newTime.setSeconds(Math.max(0, Math.min(59, seconds)));
            setTime(newTime);
            setEditedTime(newTime);
        }
    };

    return (

        <div className='clock'>
            <div className="min_hand" {...bindMinutes()} style={{ transform: `rotateZ(${minuteRotation}deg)` }} />
            <div className="sec_hand" {...bindSeconds()} style={{ transform: `rotateZ(${secondRotation}deg)` }} />
            {numbers.map((number) => (
                <span key={number} className={`num-${number}`}>{number}</span>
            ))}
            <input type="text" value={editedTime.getMinutes().toString().padStart(2, '0') + ':' + editedTime.getSeconds().toString().padStart(2, '0')} onChange={handleInputChange} />
        </div>
    );
}