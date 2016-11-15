import React from 'react';
import './NavBar.scss';
import { mapStateToProps, mapDispatchToProps} from './selectors';
import { connect } from 'react-redux';

export const NavBar = ({activePane, onClick, appTitle, buttons}) => {

  const buttonElements = buttons.map((btn) => 
    <li key={btn.id}><a href="#" key={btn.id} id={btn.id} onClick={e => {e.preventDefault(); onClick(btn.id);}}><i className={"fa " + btn.class + " fa-2x"} aria-hidden="true"></i><p>{btn.name}</p></a></li>
  );
  
  return (
     <nav id="app-navbar" className="navbar navbar-inverse">
      <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#wv-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">{appTitle}</a>
          </div>
          <div className="collapse navbar-collapse" id="#wv-navbar-collapse-1">
              <ul className="nav navbar-nav">
                {buttonElements}                    
              </ul>
          </div>
      </div>
    </nav>
  )
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
