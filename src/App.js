import React from 'react';
import Hotkeys from "react-hot-keys";
import axios from 'axios';
import styled from 'styled-components';
import './App.css'

// API ENDPOINT
const SUGGESTIONS_ENDPOINT = 'https://salty-spire-03731.herokuapp.com/suggestions'
const UPDATE_ENDPOINT = 'https://salty-spire-03731.herokuapp.com/suggestions/update'

// const SUGGESTIONS_ENDPOINT = 'http://localhost:5000/suggestions'
// const UPDATE_ENDPOINT = 'http://localhost:5000/update/'

// CSS STYLING
const TextAreaDiv = styled.div`
    padding-top: 4px;
    padding-left: 25px;
    float: left;
`;

const TextArea = styled.textarea`
    overflow: auto;
    outline: none;
    font-family: Helvetica Neue;
    font-size: 16px;
    background: #EDE3CF;

    padding-right: 8px;
    padding-top: 8px;
    padding-left: 8px;
    padding-bottom: 8px;

    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;

    resize: none; /*remove the resize handle on the bottom right*/
`;

const SuggestionDiv = styled.div`
    :hover {
        opacity: 0.75;
    }
`;

class App extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            mostRecentWord: '',
            suggestions: [],
        }
    }

    // listens to textarea, gets every keystroke change and makes
    // an API request
    onTextChange(e) {
        var text = e.target.value;
        var n = text.split(" ")
        this.setState({
            text: text,
        });
        var mostRecentWord = n[n.length - 1].toLowerCase();
        axios.get(SUGGESTIONS_ENDPOINT, {
            params: {
                prefix: mostRecentWord,
            }
        })
        .then(response => {
            console.log("Response: ", response.data);
            this.setState({
                suggestions: response.data,
                mostRecentWord: mostRecentWord,
            })
        }).catch(function(error) {
            console.log(error);
        })
        console.log("Most Recent Word: ", mostRecentWord);
    }

    // keyboard shorcut to autocomplete top suggested term
    onKeyDown(keyName, e, handle) {
        // get the best suggestion and autocomplete
        var topSuggestion = this.state.suggestions[0][0]
        var oldText = this.state.text
        var words = oldText.split(" ")
        words.pop()
        words.push(topSuggestion)
        this.setState({
            text: words.join(" ")
        });
        axios.post(UPDATE_ENDPOINT + topSuggestion, {

        })
        .then(response => {
            console.log("POST RESPONSE: ", response)
        }).catch(function(error) {
            console.log("ERROR: ", error)
        });
        console.log('Keyboard shortcut (ctrl-d) being triggered');
    }

    // handles clicking on suggested term
    onSuggestionSelect(event) {
        var topSuggestion = event.currentTarget.querySelector('p').textContent
        var oldText = this.state.text
        var words = oldText.split(" ")
        words.pop()
        words.push(topSuggestion)
        this.setState({
            text: words.join(" ")
        });
        axios.post(UPDATE_ENDPOINT + topSuggestion, {

        })
        .then(response => {
            console.log("POST RESPONSE: ", response)
        }).catch(function(error) {
            console.log("ERROR: ", error)
        });
    }

    render() {
        return(
            <Hotkeys 
                keyName="ctrl+d"
                onKeyDown={this.onKeyDown.bind(this)}
                filter={event => true}>
                <div>
                    <h1 className="App" style={{paddingLeft: '25px'}}>Scribr</h1>
                    <p className="App" style={{paddingLeft: '25px'}}>A note-taking tool for scribes.</p>
                    <div>
                        {/* notetaking area */}
                        <TextAreaDiv>
                            <TextArea rows="28" cols="85" value={this.state.text} onChange={this.onTextChange.bind(this)}>
                            </TextArea>
                        </TextAreaDiv>

                        {/* Suggestions */}
                        <div style={{float: "left", paddingLeft: "25px" }}>
                        {this.state.suggestions.map((suggestion, index) => (
                            <SuggestionDiv key={index} onClick={this.onSuggestionSelect.bind(this)}>
                                <p id="suggestion"><b>{suggestion[0]}</b></p>
                                <div id="definition" style={{width: "500px"}}>
                                    <p style={{wordWrap: "break-word"}}>{suggestion[1]}</p>
                                </div>
                            </SuggestionDiv>
                        ))}
                        </div>
                    </div>
                </div>
            </Hotkeys>
        );
    }
}

export default App;
