import React from 'react';
import ReactDom from 'react-dom';
import './search.less'
import {say} from './../../components/hello'
import logo from './../../assets/logo.jpg'
// class Search extends React.Component {
//   render() {
//     return (
//       <h1>Search Page</h1>
//     )
//   } 
// }

function Search() {
  return (
    <div>
      <img src={logo} alt="logo" />
      <h1 className="search-text">Search Page111 {say()}</h1>
    </div>
    
  )
}

ReactDom.render(<Search />, document.getElementById('root'))