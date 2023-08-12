window.addEventListener("load", () => {
  let count = 0;
  let count2 = 0;
  let taskChecked = {};
  const addTask = document.querySelector("form");
  const checkDivExist = document.querySelector(".container div:nth-child(3)");
  const formText = document.querySelector("form > input");
  const checkBox = document.querySelectorAll(".item > input");
  let confBox = document.querySelectorAll(".item");
  const deleteBtn = document.querySelectorAll(".item > button");
  const printMess = document.querySelector(".print");
  let pmessage = document.querySelector(".print p:first-of-type");
  const btn = document.querySelector(".print p:last-of-type");
  const blockScreen = document.querySelector(".block");

  let allTasks = [];
  let rout1 = "";
  let rout2 = "";
  let rout3 = "";
  let rout4 = "";
  let objRetrive = "";
  let objList = "";

  (function () {
    "user strict";
    switch (addTask.name) {
      case "today":
        rout1 = "/marked";
        rout2 = "/object";
        objRetrive = "responseObj";
        objList = "list";
        rout3 = "/delete";
        rout4 = "/delete2";
        break;
      case "work":
        rout1 = "/marked2";
        rout2 = "/object2";
        objRetrive = "responseObj2";
        objList = "list2";
        rout3 = "/delete3";
        rout4 = "/delete4";
        break;
      default:
        console.log("Ups! something went wrong.");
    }

    if (checkDivExist != null) {
      formText.className = "borB";
    }
  })();

  function printAlert(msg, show) {
    let disN = "";
    let disF = "";

    switch (show) {
      case 1:
        disN = "none";
        disF = "flex";
        break;
      case 2:
        disN = "flex";
        disF = "none";
        break;
      default:
        console.log("Ups! something went wrong.");
    }

    show = show || "none";
    printMess.style.display = disF;
    pmessage.innerHTML = msg;
    blockScreen.style.display = disF;

    confBox.forEach((box) => {
      box.style.display = disN;
    });
    addTask.style.display = disN;
  }

  btn.onclick = () => {
    printAlert(null, 2);
  };

  addTask.addEventListener("submit", (evt) => {
    evt.preventDefault();
    confBox = document.querySelectorAll(".item");
    if (confBox.length > 0) {
      confBox.forEach((box) => {
        if (allTasks.indexOf(box.childNodes[3].innerHTML) == -1) {
          allTasks.push(box.childNodes[3].innerHTML);
        }
      });
    }
    let condition = allTasks.indexOf(addTask.childNodes[1].value) > -1;
    let condition2 = document.querySelector("form > input").value.length === 0;
    let condition3 = document.querySelector("form > input").value.length > 1000;
    if (allTasks.length === 0 && condition2.length > 0) {
      evt.currentTarget.submit();
    } else if (condition && allTasks.length > 0) {
      printAlert("This task is already recorded.", 1);
    } else if (condition2) {
      printAlert("Sorry! Enter a task to record.", 1);
    } else if (condition3) {
      printAlert("Sorry! A task must contain less than 1000 characters", 1);
    } else {
      evt.currentTarget.submit();
    }
  });

  if (confBox.length > 0) {
    checkBox.forEach((box) => {
      box.addEventListener("change", function () {
        let txt = document.querySelector("." + `${this.id}`);
        if (this.checked == true) {
          txt.classList.add("line");

          confBox.forEach((box) => {
            if (box.childNodes[1].checked) {
              box.childNodes[5].setAttribute("value", count);
              taskChecked[count] = { tsk: box.childNodes[3].innerHTML };
            }
            count++;
          });
        } else {
          txt.classList.remove("line");
        }

        fechData(rout1, taskChecked);
      });
    });

    function fechData(rout, data) {
      "user strict";
      count = 0;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      fetch(rout, options);
    }

    (function () {
      "user strict";
      confBox.forEach((box) => {
        box.childNodes[5].setAttribute("value", count2);
        count2++;
      });
    })();

    function delay(milliseconds) {
      return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
      });
    }

    async function retrive() {
      let obj = {};
      fetch(rout2)
        .then((res) => res.json())
        .then((data) => {
          if (Object.keys(data).length != 0) {
            obj = { ...data };
            for (const key in data[objRetrive]) {
              let objId = data[objRetrive][key].tsk;
              let getCheckbox = document.getElementById(objId);
              let taskMarked = document.querySelector("." + objId);
              getCheckbox.checked = true;
              taskMarked.classList.add("line");
            }
          }
        });
      await delay(500);

      return obj;
    }

    const dataForDelete = retrive();

    deleteBtn.forEach((btn) => {
      btn.onclick = () => {
        confBox = document.querySelectorAll(".item");
        allTasks.length = 0;
        const taskTobeDeleted = btn.getAttribute("value");
        confBox[taskTobeDeleted].className = "noShow";
        dataForDelete.then((data) => {
          if (Object.keys(data).length != 0) {
            delete data[objList][taskTobeDeleted];
            delete data[objRetrive][taskTobeDeleted];
            fechData(rout3, data[objList]);
            fechData(rout4, data[objRetrive]);
          }
        });
      };
    });
  }
});

322;
