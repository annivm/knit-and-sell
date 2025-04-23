
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { useRef } from 'react';

import Backdrop from '../Backdrop/Backdrop';

import './Modal.css';

const ModalOverlay = props => {
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form onSubmit={props.onSubmit ? props.onSubmit : event => event.preventDefault()}>
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
      </form>
      <footer className={`modal__footer ${props.footerClass}`}>
        <h2 className='modal__footer__h2'>{props.footer}</h2>
      </footer>
    </div>
  );

  return ReactDOM.createPortal(content, document.getElementById('modal-hook'))
}

const Modal = props => {
  const nodeRef = useRef();
  return (
    <>
      {props.show && <Backdrop onClick={props.onCancel}/>}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
        nodeRef={nodeRef}
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </>
  )
}

export default Modal;