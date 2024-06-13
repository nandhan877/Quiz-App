import Header from './Header';
import { useEffect, useReducer } from 'react';
import Maini from './Maini';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishScreen from './FinishScreen';
import Footer from './Footer';
import Timer from './Timer';
const SECS_FOR_QUESTION=30;
const initialState = {
  questions: [],
  status: 'loading', // Possible values: 'loading', 'error', 'ready', 'active', 'finished'
  index:0,
  answer:null,
  points:0,
  highestscore:0,
  secondsRemaining:null
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: 'ready',
      };
    case 'dataFetchFailed':
      return {
        ...state,
        status: 'error',
      };
    case "start":
      return {...state,status:"active",
    secondsRemaining:state.questions.length*SECS_FOR_QUESTION}
    case "newAnswer":
      const question=state.questions.at(state.index);
      return {
        ...state,
        answer:action.payload,
        points:
        action.payload===question.correctOption?
        state.points+question.points:state.points
      }
    case "nextQuestion":
      return {...state,index:state.index+1,answer:null}
    case "finish":
      return {...state,status:"finished",
    highestscore:state.points>state.highestscore?state.points :state.highestscore};
    case "restart":
      return{...initialState,questions:state.questions,status:"ready"};
      case "tick":
        return {...state,secondsRemaining:state.secondsRemaining-1,
        status:state.secondsRemaining==0?"finished":state.status,
        highscore:state.points > state.highscore ? state.points : state.highscore
      }
    default:
      throw new Error('Unknown action type');
  }
}

export default function App() {
  const [{questions,status,index,answer,points,highestscore,secondsRemaining}, dispatch] = useReducer(reducer, initialState);

  const numQuestions=questions.length;
  const maxPossiblePoints=questions.reduce((prev,cur)=>prev+cur.points,0)

  useEffect(() => {
    fetch('http://localhost:8000/questions')
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((err) => {
        console.error('Error fetching data:', err);
        dispatch({ type: 'dataFetchFailed' });
      });
  }, []);


  return (
    <div className="app">
      <Header />
      <Maini>
      {status==='error' && <Error/>}
      {status==='loading' && <Loader/>}
      {status==='ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch}/>}
      {status==='active' && (
        <>
        <Progress numQuestions={numQuestions}
         index={index}
         points={points}
         maxPossiblePoints={maxPossiblePoints}
         answer={answer}
         />
      <Question question={questions[index]} dispatch={dispatch} answer={answer}/>
      <Footer>
      <Timer dispatch={dispatch}
      secondsRemaining={secondsRemaining}/>
      <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions}/>
      </Footer>
      </>
      )}

      {status==='finished' && <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} highestscore={highestscore} dispatch={dispatch}/>}
      </Maini>
    </div>
  );
}