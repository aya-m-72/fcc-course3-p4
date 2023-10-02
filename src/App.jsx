import { useReducer } from "react"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"

const initialState = {
  overwrite:false,
  previousOperand:null,
  currentOperand:"0",
  operation:null,
}
export const ACTIONS = {
  ADD_DIGIT: "ADD_DIGIT",
  CHOOSE_OPERATION: "CHOOSE_OPERATION",
  EVALUATE: "EVALUATE",
  CLEAR: "CLEAR",
  DEL: "DEL",
  ADD_SIGN:"ADD_SIGN",
}

const reducer= (state, {type,payload}) =>{
  switch(type){
    case ACTIONS.CLEAR:
      return initialState;
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return {
          ...state,
          currentOperand: payload.digit === "."?"0.":payload.digit,
          overwrite:false,
        }
      }
      if (state.currentOperand?.includes(".") && payload.digit === "."){return state;}
      if ((state.currentOperand === "0" || state.currentOperand === null) && payload.digit === "."){return {
        ...state,
        currentOperand: "0.",
      }}
      return {
        ...state,
        currentOperand: (state.currentOperand === "0"|| state.currentOperand===null )?payload.digit:`${state.currentOperand}${payload.digit}`,
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (!state.previousOperand){
        return {
          ...state,
          operation:payload.operation,
          previousOperand:state.currentOperand,
          currentOperand:null,
        }
      }
      if(state.operation){
        if(payload.operation==="-" && state.currentOperand == null){
          document.getElementById("sign").click()
          return state;
        }
        return {
          previousOperand: evaluate(state),
          operation:payload.operation,
          currentOperand:null,
        }
      }
      return state;
    case ACTIONS.EVALUATE:
      if (!state.currentOperand||!state.previousOperand||!state.operation){
        return state;
      }

      return {
        ...state,
        overwrite:true,
        currentOperand: evaluate(state),
        previousOperand:null,
        operation:null,
      }
    case ACTIONS.DEL:
      if (state.overwrite|| state.currentOperand?.length === 1){
        return initialState;
      }
      if(!state.currentOperand){
        return state;
      }
      return {
        ...state,
        currentOperand:state.currentOperand.slice(0,-1),
      }
    case ACTIONS.ADD_SIGN:
      if(state.currentOperand === "0"){
        return state;
      }
      if(state.currentOperand === "0."){
        return {...state, currentOperand:"-0."}
      }
      if (state.currentOperand === "-0.") {
        return { ...state, currentOperand: "0." }
      }
      if(state.currentOperand){
        let val = parseFloat(state.currentOperand);
        return {
          ...state,
          currentOperand: val>0?`-${state.currentOperand}`:`${Math.abs(val)}`,
        }
      }
      if(!state.currentOperand){
        return{
          ...state,
          currentOperand:"-",
        }
      }
  }
}

const evaluate=({previousOperand,operation,currentOperand})=>{
  let prev = parseFloat(previousOperand);
  let curr = parseFloat(currentOperand);
  if (isNaN(prev)||isNaN(curr)){return previousOperand;}
  let comp = ""
  switch(operation){
    case "+":
      comp = prev + curr;
      break;
    case "-":
      comp = prev - curr;
      break;
    case "x":
      comp = prev * curr;
      break;
    case "÷":
      comp = prev / curr;
      break;
  }
  return comp.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us",{
  maximumFractionDigits:0,
})

const formatOperand =(operand) =>{
  if(!operand)return;
  const[integer,decimal] = operand.split(".");
  if(isNaN(integer)){return operand}
  if(!decimal && operand.indexOf(".") === -1){return INTEGER_FORMATTER.format(integer)};
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer,initialState)

  return (
    <div className="container">
      <div className="cal-body">
        <div id="display">
          <div className="previous">{formatOperand(previousOperand)}{operation}</div>
          <div className="current">{formatOperand(currentOperand)}</div>
        </div>
        <button id="sign" onClick={()=>dispatch({type:ACTIONS.ADD_SIGN})}>+/-</button>
        <button id="clear" onClick={()=>dispatch({type:ACTIONS.CLEAR})}>AC</button>
        <button id="delete" onClick={()=>dispatch({type:ACTIONS.DEL})}>DEL</button>
        <OperationButton id="divide" dispatch={dispatch} operation="÷" />
        <DigitButton id="seven" dispatch={dispatch} digit="7" />
        <DigitButton id="eight" dispatch={dispatch} digit="8" />
        <DigitButton id="nine" dispatch={dispatch} digit="9" />
        <OperationButton id="multiply" dispatch={dispatch} operation="x" />
        <DigitButton id="four" dispatch={dispatch} digit="4" />
        <DigitButton id="five" dispatch={dispatch} digit="5" />
        <DigitButton id="six" dispatch={dispatch} digit="6" />
        <OperationButton id="subtract" dispatch={dispatch} operation="-" />
        <DigitButton id="one" dispatch={dispatch} digit="1" />
        <DigitButton id="two" dispatch={dispatch} digit="2" />
        <DigitButton id="three" dispatch={dispatch} digit="3" />
        <OperationButton id="add" dispatch={dispatch} operation="+" />
        <DigitButton id="zero" dispatch={dispatch} digit="0" />
        <DigitButton id="decimal" dispatch={dispatch} digit="." />
        <button id="equals" className="span-two" onClick={()=>dispatch({type:ACTIONS.EVALUATE})}>=</button>
      </div>
    </div>
  )
}

export default App
