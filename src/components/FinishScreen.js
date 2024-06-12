function FinishScreen({points,maxPossiblePoints,highestscore,dispatch}) {
    const percentage=(points/maxPossiblePoints)*10;
    let emoji;
    if(percentage===100) emoji = "🥇"
    if(percentage>=80 && percentage<100) emoji = "🥈"
    if(percentage>=50 && percentage<80) emoji = "🙂"
    if(percentage>0 && percentage<50) emoji = "😐"
    if(percentage===0) emoji = "🙉"
    

    return (
        <>
        <p className="result">
            You scored <strong>{points}</strong> Out of {maxPossiblePoints} ({Math.ceil(percentage)}%) {emoji}
        </p>
        <p className="highscore">(Highscore:{highestscore} points)</p>
        <button className="btn btn-ui" onClick={()=>dispatch({type:"restart"})}>Restart the quiz</button>
        </>
    )
}

export default FinishScreen
