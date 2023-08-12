import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 3000;
let list = {};
let count = 0;
let responseObj = {};
let list2 = {};
let count2 = 0;
let responseObj2 = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.render("index.ejs", { list });
});
 
app.post("/submit", (req, res) => {
  let task = req.body.task;
  // this is a condition that will stop the browser add
  //on the list whem the page is refreshed
  if (count == 0 && task != null) {
    addSubmit(task, res);
  } else if (task != list[count - 1].tsk && count > 0) {
    addSubmit(task, res);
  }
  req.body.task = null;  

});

function addSubmit(task, res) {
  list[count] = { tsk: task };
  res.render("index.ejs", { list });
  count++;
}

app.post("/marked", (req, res) => {
  responseObj = req.body;
  res.json({ responseObj });
});

app.post("/delete", (req, res) => {
  list = { ...req.body };
  count--;
});
 
app.post("/delete2", (req, res) => {
  responseObj = { ...req.body };
});

app.get("/object", (req, res) => {
  res.send({ responseObj, list });
});

// work page==========================

app.get("/work", (req, res) => {
  res.render("work.ejs", { list2 });
});

app.post("/submit2", (req, res) => {
  const task = req.body.task;
  addSubmit2(task, res);
});
function addSubmit2(task, res) {
  list2[count2] = { tsk: task };
  res.render("work.ejs", { list2 });
  count2++;
}

app.post("/marked2", (req, res) => {
  responseObj2 = req.body;
  res.json({ responseObj2 });
});

app.post("/delete3", (req, res) => {
  list2 = { ...req.body };

  count2--;
});

app.post("/delete4", (req, res) => {
  responseObj2 = { ...req.body };
});

app.get("/object2", (req, res) => {
  res.send({ responseObj2, list2 });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
      