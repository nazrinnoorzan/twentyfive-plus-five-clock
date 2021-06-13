import { useState, useRef, useEffect } from "react"
import "./App.css"

// components
import SetTimer from "./components/SetTimer"

function App() {
  const [displayTime, setDisplayTime] = useState(25 * 60)
  const [breakTime, setBreakTime] = useState(5 * 60)
  const [sessionTime, setSessionTime] = useState(25 * 60)
  const [timerOn, setTimerOn] = useState(true)
  const [onBreak, setOnBreak] = useState(false)
  const audio = useRef()

  // trigger onBreak true or false
  useEffect(() => {
    if (displayTime <= 0) {
      setOnBreak(true)
      audio.current.currentTime = 0
      audio.current.play()
    } else if (timerOn && displayTime === breakTime) {
      setOnBreak(false)
    }
  }, [displayTime, onBreak, timerOn, breakTime, sessionTime])

  // format seconds to time for the display
  function formatTime(time) {
    let minutes = Math.floor(time / 60)
    let seconds = time % 60
    return (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds)
  }

  // format seconds to minute for the timer control
  function formatSetTime(time) {
    let minutes = Math.floor(time / 60)
    return minutes
  }

  // change display time when adjusting the break/session time
  function changeTime(amount, type) {
    if (type === "break") {
      if (breakTime <= 60 && amount < 0) {
        return
      }
      setBreakTime(prev => prev + amount)
    } else {
      if (sessionTime <= 60 && amount < 0) {
        return
      }
      setSessionTime(prev => prev + amount)
      if (timerOn) {
        setDisplayTime(sessionTime + amount)
      }
    }
  }

  // start the countdown
  function controlTime() {
    let second = 1000
    let date = new Date().getTime()
    let nextDate = new Date().getTime() + second
    let onBreakVariable = false
    if (timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime()
        if (date > nextDate) {
          setDisplayTime(prev => {
            if (prev <= 0 && !onBreakVariable) {
              audio.current.currentTime = 0
              audio.current.play()
              onBreakVariable = true
              return breakTime
            } else if (prev <= 0 && onBreakVariable) {
              onBreakVariable = false
              setOnBreak(false)
              return sessionTime
            }
            return prev - 1
          })
          nextDate += second
        }
      }, 30)
      localStorage.clear()
      localStorage.setItem("interval-id", interval)
    }

    if (!timerOn) {
      clearInterval(localStorage.getItem("interval-id"))
    }

    setTimerOn(!timerOn)
  }

  // reset the display time to default
  function resetTime() {
    setDisplayTime(25 * 60)
    setBreakTime(5 * 60)
    setSessionTime(25 * 60)
  }

  return (
    <div id="container">
      <div id="app">
        <div className="main-title">25 + 5 Clock</div>
        <SetTimer title={"Break Length"} changeTime={changeTime} type={"break"} time={breakTime} formatTime={formatSetTime} />
        <SetTimer title={"Session Length"} changeTime={changeTime} type={"session"} time={sessionTime} formatTime={formatSetTime} />
        <div className="timer" style={{ color: "white" }}>
          <div className="timer-wrapper">
            <div id="timer-label">{onBreak ? "Break" : "Session"}</div>
            <div id="time-left">{formatTime(displayTime)}</div>
          </div>
        </div>
        <div className="timer-control">
          <button id="start_stop" onClick={controlTime}>
            <i className="fa fa-play fa-2x"></i>
            <i className="fa fa-pause fa-2x"></i>
          </button>
          <button id="reset" onClick={resetTime}>
            <i className="fa fa-refresh fa-2x"></i>
          </button>
        </div>
        <audio ref={audio} id="beep" preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
      </div>
    </div>
  )
}

export default App
