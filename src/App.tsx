import React, { Component, useState } from 'react';
import './App.css';
import { AppBar, Button, FormControl, InputLabel, MenuItem, Select, TextareaAutosize, TextField, Toolbar, Typography, Collapse } from '@mui/material';
import { DataGrid, GridRowsProp, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import {StringDiff} from 'react-string-diff';


function App() {
  const [verseSelection, setVerseSelection] = useState<string>("");
  const [allApiText, setAllApiText] = useState<any>([]);
  const [allVerseReferences, setAllVerseReferences] = useState<any>([]);
  const [rows, setRows] = useState<any>([]);
  const columns: GridColDef[] = [
    { field: 'diff', 
      headerName: 'Difference', 
      flex:1,
      renderCell: (params) => {
        return <div>{params.value}</div>;
      } 
    },
  ];
  const axios = require('axios');
  let sections: any[] = [];
  const books = [
      { name: "Genesis", chapters: 50, abbrev: "Gen" },
      { name: "Exodus", chapters: 40, abbrev: "Exo" },
      { name: "Leviticus", chapters: 27, abbrev: "Lev" },
      { name: "Numbers", chapters: 36, abbrev: "Num" },
      { name: "Deuteronomy", chapters: 34, abbrev: "Deut" },
      { name: "Joshua", chapters: 24, abbrev: "Josh" },
      { name: "Judges", chapters: 21, abbrev: "Judg" },
      { name: "Ruth", chapters: 4, abbrev: "Ruth" },
      { name: "1 Samuel", chapters: 31, abbrev: "1 Sam" },
      { name: "2 Samuel", chapters: 24, abbrev: "2 Sam" },
      { name: "1 Kings", chapters: 22, abbrev: "1 Kings" },
      { name: "2 Kings", chapters: 25, abbrev: "2 Kings" },
      { name: "1 Chronicles", chapters: 29, abbrev: "1 Chron" },
      { name: "2 Chronicles", chapters: 36, abbrev: "2 Chron" },
      { name: "Ezra", chapters: 10, abbrev: "Ezra" },
      { name: "Nehemiah", chapters: 13, abbrev: "Neh" },
      { name: "Esther", chapters: 10, abbrev: "Esth" },
      { name: "Job", chapters: 42, abbrev: "Job" },
      { name: "Psalms", chapters: 150, abbrev: "Psa" },
      { name: "Proverbs", chapters: 31, abbrev: "Prov" },
      { name: "Ecclesiastes", chapters: 12, abbrev: "Eccl" },
      { name: "Song of Solomon", chapters: 8, abbrev: "SS" },
      { name: "Isaiah", chapters: 66, abbrev: "Isa" },
      { name: "Jeremiah", chapters: 52, abbrev: "Jer" },
      { name: "Lamentations", chapters: 5, abbrev: "Lam" },
      { name: "Ezekiel", chapters: 48, abbrev: "Ezek" },
      { name: "Daniel", chapters: 12, abbrev: "Dan" },
      { name: "Hosea", chapters: 14, abbrev: "Hosea" },
      { name: "Joel", chapters: 3, abbrev: "Joel" },
      { name: "Amos", chapters: 9, abbrev: "Amos" },
      { name: "Obadiah", chapters: 1, abbrev: "Oba" },
      { name: "Jonah", chapters: 4, abbrev: "Jonah" },
      { name: "Micah", chapters: 7, abbrev: "Micah" },
      { name: "Nahum", chapters: 3, abbrev: "Nahum" },
      { name: "Habakkuk", chapters: 3, abbrev: "Hab" },
      { name: "Zephaniah", chapters: 3, abbrev: "Zeph" },
      { name: "Haggai", chapters: 2, abbrev: "Hag" },
      { name: "Zechariah", chapters: 14, abbrev: "Zech" },
      { name: "Malachi", chapters: 4, abbrev: "Mal" },
      { name: "Matthew", chapters: 28, abbrev: "Matt" },
      { name: "Mark", chapters: 16, abbrev: "Mark" },
      { name: "Luke", chapters: 24, abbrev: "Luke" },
      { name: "John", chapters: 21, abbrev: "John" },
      { name: "Acts", chapters: 28, abbrev: "Acts" },
      { name: "Romans", chapters: 16, abbrev: "Rom" },
      { name: "1 Corinthians", chapters: 16, abbrev: "1 Cor" },
      { name: "2 Corinthians", chapters: 13, abbrev: "2 Cor" },
      { name: "Galatians", chapters: 6, abbrev: "Gal" },
      { name: "Ephesians", chapters: 6, abbrev: "Eph" },
      { name: "Philippians", chapters: 4, abbrev: "Phil" },
      { name: "Colossians", chapters: 4, abbrev: "Col" },
      { name: "1 Thessalonians", chapters: 5, abbrev: "1 Thes" },
      { name: "2 Thessalonians", chapters: 3, abbrev: "2 Thes" },
      { name: "1 Timothy", chapters: 6, abbrev: "1 Tim" },
      { name: "2 Timothy", chapters: 4, abbrev: "2 Tim" },
      { name: "Titus", chapters: 3, abbrev: "Titus" },
      { name: "Philemon", chapters: 1, abbrev: "Philem" },
      { name: "Hebrews", chapters: 13, abbrev: "Heb" },
      { name: "James", chapters: 5, abbrev: "James" },
      { name: "1 Peter", chapters: 5, abbrev: "1 Pet" },
      { name: "2 Peter", chapters: 3, abbrev: "2 Pet" },
      { name: "1 John", chapters: 5, abbrev: "1 John" },
      { name: "2 John", chapters: 1, abbrev: "2 John" },
      { name: "3 John", chapters: 1, abbrev: "3 John" },
      { name: "Jude", chapters: 1, abbrev: "Jude" },
      { name: "Revelation", chapters: 22, abbrev: "Rev" },
  ]
  const getVerseList = async (verseString: string) => {

      // Make sure books with one chapter have a 1 as the chapter ie "Philemon; 1 Sam 2:12-36" to "Philemon 1; 1 Sam 2:12-36"
      verseString = verseString.replace(/(\D);/g, "$1 1;");
      verseString = verseString.replace(/(\D$)/g, "$1 1");

      // Split into sectons: [Matt. 1, ..., Psalm 140:12-141:9]
      var verseList = verseString.replace(/; /g, ";").split(';');

      // Loop through verseList
      for (var i = 0; i < verseList.length; i++) {

        // Split by space between bookname and section
        var str = verseList[i]
        var bookName = str.substr(0, str.lastIndexOf(" "))
        var section = str.substr(str.lastIndexOf(" ") + 1, str.length);

        // Replace any abbreviations
        bookName = bookName.replace(/\./g, "")
        if (bookName == 'Psalm') {
          bookName = 'Psalms'
        }
        books.forEach((book: { abbrev: any; name: any; }) => {
          if (bookName == book.abbrev) {
            bookName = book.name
          }
        });

        var match = section.match(/(?:(\d+):(\d+)-(\d+)+:(\d+))|(?:(\d+):(\d+)-(\d+))|(?:(\d+)-(\d+):(\d+))|(?:(\d+)-(\d+))|(?:(\d+):(\d+))|(\d+)/) || [""]

        var chapterNum
        var sectionTitle = true

        // John 1:2-3:4
        // John (1):(2)-(3):(4)
        if (match[1]) {
          await getVerses({ bookName, chapterNum: match[1], start: match[2], sectionTitle });
          await getVerses({ bookName, chapterNum: match[3], end: match[4], sectionTitle });
        }

        // Matt. 5:6-7
        // Matt. (5):(6)-(7)
        else if (match[5]) {
          await getVerses({ bookName, chapterNum: match[5], start: match[6], end: match[7], sectionTitle });
        }
        
        // Matt. 8-9:10
        // Matt. (8)-(9):(10)
        else if (match[8]) {
          for (chapterNum = parseInt(match[8]); chapterNum <= parseInt(match[9])-1; chapterNum++) {
            await getVerses({ bookName, chapterNum });
          }
          await getVerses({ bookName, chapterNum: match[9], end: match[10], sectionTitle });
        }
        // John 11-12
        // John (11)-(12)
        else if (match[11]) {
          for (chapterNum = parseInt(match[11]); chapterNum <= parseInt(match[12]); chapterNum++) {
            await getVerses({ bookName, chapterNum });
          }
        }

        // Matthew 13:14
        // Matthew (13):(14)
        else if (match[13]) {
          await getVerses({ bookName, chapterNum: match[13], start: match[14], end: match[14], sectionTitle });
        }

        // Matt. 15
        // Matt. (15)
        else if (match[15]) {
          await getVerses({ bookName, chapterNum: match[15] });
        }
      }
    return sections;
  }
  const getVerses = async (payload: { bookName: any; chapterNum: any; start?: any; sectionTitle?: any; end?: any; resetVerses?: any; }) => {
      // Set default values
      var { bookName, chapterNum, start = 1, end, sectionTitle = false, resetVerses = false } = payload
      if (resetVerses) {
        sections = []
      }

      // make sure proper integer formats
      chapterNum = parseInt(chapterNum)
      start = parseInt(start)

      // last possible verse Psa. 119:176  // Second longest book Numbers 7:89
      if (end === undefined) {
        if (bookName == 'Psalms' && chapterNum == '119') {
          end = 176
        } else {
          end = 89
        }
      } else {
        end = parseInt(end)
      }

      // If section title requested (true: Genesis 1:1-26) else print Genesis 1
      if (sectionTitle == false) {
        var title = bookName + " " + chapterNum
      }
      else {
        if (start != end) {
          title = bookName + " " + chapterNum + ":" + start + "-" + end
        } else {
          title = bookName + " " + chapterNum + ":" + start
        }

      }

      //Try catch block to log and capture errors
      try {
        /*
          * Takes a specific api request to get a certain range of verses. Only 30 verses can be fetched
          * at a time. The await keyword is crucial as it allows each axios request to complete before
          * moving to the next one. Storing the requests inside an array assures the verses are printed in
          * the proper order
          */

        // Make requests in sections or 30 or less verses i.e. 1-29
        // If next == end, we have finished looping else
        // Select next 30 verses unless end is reached
        var next = 0
        while (next != end) {
          next = start + 29
          if (next > end) {
            next = end
          }
          // Make axios request ie. Genesis 4:5-20 https://api.lsm.org/recver.php?String=Genesis 4:5-20&Out=json
          const response = await axios.get(`https://api.lsm.org/recver.php?String=${bookName} ${chapterNum}:${start}-${next}&Out=json`)
          var data = response.data
          console.log(`API requested: ${bookName} ${chapterNum}:${start}-${next}`)
          console.log(response)

          // The response format is a "\[ *verse* \]" string returned for "Rom. 16:24", "Mark 9:44", and "Mark 9:46" for json parsing
          // The replace function will look for all backslashes and replace them with nothing
          // Then the JSON.parse function will turn the json string variable into an array
          if (typeof data == "string") {
            console.log(data)
            var removeSlash = data.replace(/\\/g, "").replace(/\//g, "")
            data = JSON.parse(removeSlash)
          }

          // For each verse remove [ and ] except for "Rom. 16:24", "Mark 9:44", and "Mark 9:46"
          // Find then remove all verses that do not exist: "No such verse..."
          for (var index = 0; index < data.verses.length; index++) {
            var verse = data.verses[index];

            if (verse.ref != "Rom. 16:24" && verse.ref != "Mark 9:44" && verse.ref != "Mark 9:46") {
              verse.text = verse.text.replace(/\[/g, "").replace(/\]/g, "")
            }

            if (verse.text.startsWith("No such verse")) {
              next = end
              break
            }

            // Add catchup days ie when reference does not work supply this verse
            if (verse.text.startsWith("No such ref")) {
              if (title.slice(-3, -1) == " 1") {
                title = title.slice(0, -2)
              }
              verse.text = "Enjoy my fav verse :) Phil. 4:19 And my God will fill your every need according to His riches, in glory, in Christ Jesus."
              next = end
            }
          }
          data.verses = data.verses.slice(0, index)

          // Create payload for mutation: object with title & verses
          var section = {
            title: title,
            verses: data.verses
          }
          // Commit if request is not empty ie. no verses
          if (section.verses.length != 0) {
            sections.push(section)
          }

          // Disable title for the following requests ie. for Genesis 1:1-35 disable for 1:31-35
          title = ""
          start += 30;
        }
      } catch (error) {
        console.log(error)
      }
  }
  const checkVerse = (index: number, text: string) => {
    var userText = text.replace(/[^a-zA-Z ]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
    var verseText = allApiText[index].replace(/[^a-zA-Z ]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
    if (userText !== verseText && userText !=="") {
      console.log(index, userText, verseText)
      setRows([...rows, { id: index, diff: <StringDiff className='stringDiff' key={index} oldValue={userText} newValue={verseText} /> }]);
    } else if (userText !=="") {
      setRows([...rows, {id: index, diff: "Correct!"}]);
    } else {
      if (rows.filter((e: { id: number; }) => e.id == index)) {
        setRows(rows.filter((e: { id: number; }) => e.id !== index))
      }
    }
  }
  const renderVerseDiff = (index: number) => {
    const result: any[] = rows.filter((e: { id: number; }) => e.id == index);
    if (result.length !== 0) {
      return result[result.length-1].diff
    }
    return ""
  }
  return (
    <div className="App">
      <header className="App-header">
        <AppBar position="static">
          <Toolbar variant="dense">          
          <Typography style={{marginRight: "10px"}}>
            Bible Memorizer
          </Typography>    
          </Toolbar>
        </AppBar>
      </header>
      <body>
        <div>
          <FormControl className="formControl">
            <TextField 
              id="enter-verses"
              label="Enter Verses: (ex: Gen. 1:1-15; Col 1:16, 2:20)" 
              variant="outlined"
              size="medium"
              defaultValue={verseSelection}
              onBlur={(event) => setVerseSelection(event.currentTarget.value)}/>
          </FormControl>
        </div>
        <Button 
          variant="contained" 
          className="submitButton" 
          onClick={async () => {
            setRows([])
            const response = await getVerseList(verseSelection);
            console.log(response)
            setAllApiText(response.flatMap(section => section.verses.flatMap((verse: { text: any; }) => verse.text)))
            const VerseReferences = response.flatMap(section => section.verses.flatMap((verse: { ref: any; }) => verse.ref))
            setAllVerseReferences(VerseReferences)
          }}>
            Load Verses
        </Button>
        
        <FormControl className="formControl">
          {allVerseReferences.map((reference: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined, index: number) => (
            <div>
              <TextField 
                autoComplete="off"
                id="enter-verses"
                key={index}
                label={reference}
                variant="outlined"
                size="medium"
                onBlur={(event) => checkVerse(index, event.currentTarget.value)}
              />
              {renderVerseDiff(index)}
            </div>
            
            ))}
        </FormControl>
          {/* <div className="datagrid">
          <DataGrid rows={rows} columns={columns}/>
          </div> */}
      </body>
    </div>
  );
}

export default App;
