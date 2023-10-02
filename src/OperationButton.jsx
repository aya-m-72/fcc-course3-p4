import {ACTIONS} from "./App"
const OperationButton = ({dispatch, operation, id}) => {
  return (
    <button id={id} onClick={()=>dispatch({type:ACTIONS.CHOOSE_OPERATION, payload:{operation}})}>{operation}</button>
  )
}
export default OperationButton