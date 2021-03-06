import React, { Component } from 'react';
import './Gomoku.css';


class Square extends Component {
  
  render() {
    return (
      <button className="square" onClick={this.props.onClick}>
        {this.props.mark}
      </button>
    );
  }
}


class Row extends Component {
  
  render() {
    const squares = [];
    for (let i = 0; i < 15; i++) {
      squares.push(
        <Square key={i}
                mark={this.props.marksOnRow[i]}
                onClick={() => this.props.onClick(i)} />
      );
    }
    
    return (
      <div className="row">
        {squares}
      </div>
    );
  }
}


class Board extends Component {
  
  render() {
    const rows = [];
    for (let j = 0; j < 15; j++) {
      rows.push(
        <Row key={j}
             marksOnRow={this.props.marks[j]}
             onClick={(i) => this.props.onClick(j, i)} />
      );
    }
    
    return (
      <div className="board">
        {rows}
      </div>
    );
  }
}


class Move extends Component {

  render() {
    return (
      <li className="move">
        <button onClick={this.props.onClick}>
          {this.props.status}
        </button>
      </li>
    );
  }
}


class Info extends Component {

  render() {
    const moves = [];
    for (let i = 0; i < this.props.statuses.length; i++) {
      moves.push(
        <Move key={i}
              status={this.props.statuses[i]}
              onClick={() => this.props.onClick(i)} />
      );
    }

    return (
      <ol className="info">
        {moves}
      </ol>
    );
  }
}


class Game extends Component {
  
  constructor(props) {
    super(props);

    const initialMarks = [];
    for (let j = 0; j < 15; j++) {
      initialMarks.push(Array(15).fill(null));
    }
    this.state = {
      history: [{
        marks: initialMarks,
        status: "Game started"
      }],
      moveNumber: 0
    };
  }

  checkWinner(marks, j, i) {
    const markType = marks[j][i];
    const boardHeight = marks.length;
    const boardWidth = marks[0].length;
    
    function checkLine(deltaJ, deltaI, reversedDeltaJ, reversedDeltaI) {
      
      function checkBound(checkedSquareJ, checkedSquareI) {
        return checkedSquareJ < 0 || checkedSquareJ > boardHeight - 1 ||
          checkedSquareI < 0 || checkedSquareI > boardWidth - 1;
      }
      
      for (var k = 0; k < 4; k++) {
        let checkedSquareJ = j + deltaJ(k);
        let checkedSquareI = i + deltaI(k);
        if (checkBound(checkedSquareJ, checkedSquareI) ||
            marks[checkedSquareJ][checkedSquareI] !== markType) break;
      }
      for (var l = 0; l < 4 - k; l++) {
        let checkedSquareJ = j + reversedDeltaJ(l);
        let checkedSquareI = i + reversedDeltaI(l);
        if (checkBound(checkedSquareJ, checkedSquareI) ||
            marks[checkedSquareJ][checkedSquareI] !== markType) break;
      }
      if (k + l === 4) return true;
      return false;
    }

    if (checkLine((k) => -(k + 1),
                  (k) => 0,
                  (l) => l + 1,
                  (l) => 0) ||
        checkLine((k) => 0,
                  (k) => -(k + 1),
                  (l) => 0,
                  (l) => l + 1) ||
        checkLine((k) => -(k + 1),
                  (k) => -(k + 1),
                  (l) => l + 1,
                  (l) => l + 1) ||
        checkLine((k) => -(k + 1),
                  (k) => k + 1,
                  (l) => l + 1,
                  (l) => -(l + 1))) return markType;
    return null;
  }
  
  clickSquare(j, i) {
    const newHistory = this.state.history.slice();
    
    if (!newHistory[this.state.moveNumber].marks[j][i] && !this.state.winner) {
      const newMarks = [];
      for (let i = 0; i < 15; i++) {
        newMarks.push(newHistory[this.state.moveNumber].marks[i].slice());
      }
      newMarks[j][i] = this.state.xIsCurrentPlayer ? "X" : "O";
      const newWinner = this.checkWinner(newMarks, j, i);
      let newStatus = newMarks[j][i] + " made a move at " + i + "-" + j;
      if (newWinner) {
        newStatus += " and won the game";
      }
      
      this.setState({
        history: newHistory.concat([{
          marks: newMarks,
          status: newStatus
        }]),
        moveNumber: this.state.moveNumber + 1,
        xIsCurrentPlayer: !this.state.xIsCurrentPlayer,
        winner: newWinner
      });
    }
  }

  clickMove(i) {
    if (i < this.state.moveNumber) {
      const newHistory = this.state.history.slice(0, i + 1);
      
      this.setState({
        history: newHistory,
        moveNumber: i,
        xIsCurrentPlayer: i % 2 === 1,
        winner: null
      });
    }
  }
  
  render() {
    const history = this.state.history;
    const marks = history[this.state.moveNumber].marks;
    const statuses = [];
    for (let i = 0; i < history.length; i++) {
      statuses.push(history[i].status);
    }
    
    return (
      <div className="game">
        <Board marks={marks}
               onClick={(j, i) => this.clickSquare(j, i)} />
        <Info statuses={statuses}
              onClick={(i) => this.clickMove(i)} />
      </div>
    );
  }
}


export default Game;
