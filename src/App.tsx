import React, { useState } from 'react';
import './App.css';
import { AppBar, FormControl, InputLabel, MenuItem, Select, TextareaAutosize, TextField, Toolbar } from '@mui/material';

function App() {
  const [book, setBook] = useState<string>("Matthew");
  const [chapter, setChapter] = useState<string>("1");
  const [text, setText] = useState<string>();
  return (
    <div className="App">
      <header className="App-header">
        <AppBar position="static">
          <Toolbar variant="dense">
            Bible Memorizer
          </Toolbar>
        </AppBar>
      </header>
      <body>
        <div>
          <FormControl className="formControl">
            <InputLabel id="demo-simple-select-label">Book</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="selectedBook"
              className="selectField"
              defaultValue={book}
              onChange={(event) => setBook(event.target.value as string)}
            >
              <MenuItem value={"Matthew"}>Matthew</MenuItem>
              <MenuItem value={"Mark"}>Mark</MenuItem>
              <MenuItem value={"Luke"}>Luke</MenuItem>
              <MenuItem value={"John"}>John</MenuItem>
            </Select>
          </FormControl>
          <FormControl className="formControl">
            <TextField 
              id="standard-basic"
              label="Chapter" 
              variant="standard" 
              defaultValue={chapter}
              onBlur={(event) => setChapter(event.currentTarget.value)}/>
          </FormControl>
        </div>
        <div>
          <TextareaAutosize className="textArea"/>
        </div>
      </body>
    </div>
  );
}


export default App;
