import React, { useState, useEffect } from 'react';
import './style.css';

export default function App() {
  // Input States
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4);

  // Timer States
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Store in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('Work'); // 'Work', 'Short Break', 'Long Break'
  const [completedSessions, setCompletedSessions] = useState(0);

  // 1. Logic to Switch Modes
  const switchMode = () => {
    if (mode === 'Work') {
      const newCompleted = completedSessions + 1;
      setCompletedSessions(newCompleted);

      // Check if we need a Long Break
      if (newCompleted % sessionsBeforeLongBreak === 0) {
        setMode('Long Break');
        setTimeLeft(longBreakDuration * 60);
      } else {
        setMode('Short Break');
        setTimeLeft(shortBreakDuration * 60);
      }
    } else {
      // If coming from any break, go back to work
      setMode('Work');
      setTimeLeft(workDuration * 60);
    }
    // Optional: Auto-pause after switching or keep running?
    // setIsActive(false); 
  };

  // 2. The Timer Logic (useEffect)
  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Timer finished, switch mode
      switchMode();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]); // Dependencies ensure no stale closures

  // 3. Handlers
  const handleStart = () => {
    // Validation
    if (!workDuration || !shortBreakDuration || !longBreakDuration) {
      alert("Please enter valid durations");
      return;
    }
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setMode('Work');
    setCompletedSessions(0);
    setTimeLeft(workDuration * 60);
  };

  const handleSkip = () => {
    switchMode();
  };

  // Helper to sync input changes to timer if timer is paused
  const updateDuration = (setter, val, isWorkTime) => {
    setter(Number(val));
    // If we change the setting while in that mode and paused, update the display immediately
    if (!isActive && mode === (isWorkTime ? 'Work' : mode)) {
        // This is a simple update logic, can be expanded
    }
  };

  // Helper for formatting "MM:SS"
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', fontFamily: 'sans-serif' }}>
      <h1>🍅 Pomodoro Timer</h1>

      {/* Settings Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', textAlign: 'right' }}>
        <label>Work (min):</label>
        <input 
          type="number" 
          value={workDuration} 
          onChange={(e) => {
            setWorkDuration(Number(e.target.value));
            if(mode === 'Work' && !isActive) setTimeLeft(Number(e.target.value) * 60);
          }} 
        />

        <label>Short Break (min):</label>
        <input 
          type="number" 
          value={shortBreakDuration} 
          onChange={(e) => setShortBreakDuration(Number(e.target.value))} 
        />

        <label>Long Break (min):</label>
        <input 
          type="number" 
          value={longBreakDuration} 
          onChange={(e) => setLongBreakDuration(Number(e.target.value))} 
        />

        <label>Long Break after:</label>
        <input 
          type="number" 
          value={sessionsBeforeLongBreak} 
          onChange={(e) => setSessionsBeforeLongBreak(Number(e.target.value))} 
        />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {!isActive ? (
           <button onClick={handleStart}>Start</button>
        ) : (
           <button onClick={handlePause}>Pause</button>
        )}
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleSkip}>Skip</button>
      </div>

      {/* Display */}
      <div style={{ border: '2px solid #333', padding: '20px', borderRadius: '10px', width: '300px', textAlign: 'center' }}>
        <h3>⏱ Mode: {mode}</h3>
        <h1 style={{ fontSize: '3rem', margin: '10px 0' }}>
          {formatTime(timeLeft)}
        </h1>
        <p>🔄 Sessions Completed: {completedSessions} / {sessionsBeforeLongBreak}</p>
      </div>
    </div>
  );
}
