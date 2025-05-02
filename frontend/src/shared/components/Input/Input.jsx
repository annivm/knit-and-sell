
import './Input.css';

const Input = props => {
  return (
    <div className="form-control">
      <label htmlFor={props.id}>{props.label}</label>
      <input ref={props.ref} id={props.id} type={props.type} placeholder={props.placeholder} readOnly={props.readOnly}/>
    </div>
  )
};

export default Input;
