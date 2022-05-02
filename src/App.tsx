import React, { Component, useState } from 'react';
import './App.css';
import { AppBar, Button, FormControl, InputLabel, MenuItem, Select, TextareaAutosize, TextField, Toolbar, Typography, Collapse } from '@mui/material';
import { DataGrid, GridRowsProp, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import {StringDiff} from 'react-string-diff';


function App() {
  const [book, setBook] = useState<string>("Matthew");
  const [chapter, setChapter] = useState<string>("1");
  const [text, setText] = useState<string>();
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const columns: GridColDef[] = [
    { field: 'verse', headerName: 'Verse', width:100},
    { field: 'diff', 
      headerName: 'Difference', 
      flex:1,
      renderCell: (params) => {
        return <div>{params.value}</div>;
      } 
    },
  ];
  return (
    <div className="App">
      <header className="App-header">
        <AppBar position="static">
          <Toolbar variant="dense">          
          <Typography style={{marginRight: "10px"}}>
            Bible Memorizer
          </Typography>    
          <Button variant="outlined" color="inherit" href="https://google.com">
            How To Use
          </Button>
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
              <MenuItem value={"Psalms"}>Psalms</MenuItem>
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
          <TextareaAutosize 
            className="textArea"
            onBlur={(event) => setText(event.currentTarget.value)}
          />
          <br />
          <Button 
          variant="contained" 
          className="submitButton" 
          onClick={async () => {
            var loc = +chapter-1;
            const response = await import('./assets/biblebooks/' + book + '.json');
            const chapterText = response[loc];
            var textArr = text!.split('\n');
            var rowArray: any[] = [];
            for(let row = 0; row < chapterText.length; row++){
              if(row >= chapterText.length){
                break;
              }
              var userText = row < textArr.length ? textArr[row].replace(/[^a-zA-Z ]/g, '').replace(/\s+/g, ' ').trim().toLowerCase() : "";
              var verseText = chapterText[row].replace(/[^a-zA-Z ]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
              if(userText !== verseText){
                setSuccess(false);
                var diff = <StringDiff oldValue={userText} newValue={verseText} />;
                rowArray.push({id: row, verse: (row+1), diff: diff});
              }
            }
            if(rowArray.length <= 0){
              setSuccess(true);
            }
            setRows(rowArray);

          }}>
            Submit
          </Button>
        </div>
        <br />
        <div className="errors">
          {success ? "Success! You've made no errors." : ""}
          <div className="datagrid">
          <DataGrid rows={rows} columns={columns}/>
          </div>
        </div>
      </body>
    </div>
  );
}

export default App;
