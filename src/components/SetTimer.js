function SetTimer(props) {
  return (
    <div className="length-control">
      <div id="break-label">{props.title}</div>
      <button className="btn-level" id="break-decrement" value="-" onClick={() => props.changeTime(-60, props.type)}>
        <i className="fa fa-arrow-down fa-2x"></i>
      </button>
      <div className="btn-level" id="break-length">
        {props.formatTime(props.time)}
      </div>
      <button className="btn-level" id="break-increment" value="+" onClick={() => props.changeTime(60, props.type)}>
        <i className="fa fa-arrow-up fa-2x"></i>
      </button>
    </div>
  )
}

export default SetTimer
