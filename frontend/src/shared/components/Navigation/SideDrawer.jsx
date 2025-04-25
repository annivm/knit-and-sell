import { useRef } from "react"
import { CSSTransition } from 'react-transition-group'
import ReactDOM from 'react-dom'
import './SideDrawer.css'


const SideDrawer = props => {
    const nodeRef = useRef();
    const content = (
        <CSSTransition
        in={props.show}
        timeout={200}
        classNames="slide-in-left"
        mountOnEnter
        unmountOnExit
        nodeRef={nodeRef}
        >
            <aside className="side-drawer" onClick={props.onClick}>{props.children}</aside>
        </CSSTransition>
    );
    return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
}

export default SideDrawer;