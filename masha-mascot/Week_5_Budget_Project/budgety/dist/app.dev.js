"use strict"; //BUDGET CONTROLLER

var budgetController = function () {
  var Expense = function Expense(id, description, value) {
    // functions constructure
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round(this.value / totalIncome * 100);
    } else {
      this.percentage = -1;
    }
  }; //all obj that are created with Expense prototype will inherit this method(cause of prototype)


  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  var Income = function Income(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function calculateTotal(type) {
    var sum = 0;
    data.allItems[type].forEach(function (currentElement) {
      sum += currentElement.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };
  return {
    addItem: function addItem(type, des, val) {
      var newItem, ID; // create new ID

      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      } //create new item based on type


      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      } //push it into data structure


      data.allItems[type].push(newItem); //return new element

      return newItem;
    },
    deleteItem: function deleteItem(type, id) {
      // id = 6
      //data.allItems[type][id];
      //ids = [1 2 4 /6/ 8]
      // index = 3
      var ids, index;
      ids = data.allItems[type].map(function (currentElem) {
        return currentElem.id;
      });
      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    calculateBudget: function calculateBudget() {
      // Calculate total income and expenses why pivate
      calculateTotal("exp");
      calculateTotal("inc"); // Calculate budget: income - expenses

      data.budget = data.totals.inc - data.totals.exp; // calculate the percentage of income that we spent

      if (data.totals.inc > 0) {
        data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
      } else {
        data.percentage = -1;
      }
    },
    calculatePercentages: function calculatePercentages() {
      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },
    getPercentages: function getPercentages() {
      var allPercentages = data.allItems.exp.map(function (cur) {
        return cur.getPercentage();
      });
      return allPercentages;
    },
    getBudget: function getBudget() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },
    testing: function testing() {
      console.log(data);
    }
  };
}(); //UI CONTROLLER


var UIController = function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBTN: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };

  var formatNumber = function formatNumber(number, type) {
    var numSplit, _int, dec, sign;
    /** +/-  before number
     exactly 2 decimal points
      comma separating the thousands
      
      2310.4567 -> +2,310.46
      2000 -> + 2,000.00 */


    number = Math.abs(number);
    number = number.toFixed(2); //method from Number

    numSplit = number.split(".");
    _int = numSplit[0];

    if (_int.length > 3) {
      _int = _int.substr(0, _int.length - 3) + "," + _int.substr(_int.length - 3, _int.length);
    }

    dec = numSplit[1];
    return (type === "exp" ? "-" : "+") + " " + _int + "." + dec;
  };

  var nodeListForEach = function nodeListForEach(list, callbackF) {
    for (var index = 0; index < list.length; index++) {
      callbackF(list[index], index);
    }
  };

  return {
    getInput: function getInput() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        //either for inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    addListItem: function addListItem(obj, type) {
      var html, newHtml, element; // Create html string with placeholder text

      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        if (type === "exp") {
          element = DOMstrings.expensesContainer;
          html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
      } // Replace the placeholder text with some actual data


      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type)); // Insert the HTML into the DOM

      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    deleteListItem: function deleteListItem(selectorID) {
      //selectorID = income-0
      var element;
      element = document.getElementById(selectorID);
      element.parentNode.removeChild(element);
    },
    clearFields: function clearFields() {
      var fields, fieldsArray;
      fields = document.querySelectorAll(DOMstrings.inputDescription + "," + DOMstrings.inputValue);
      fieldsArray = Array.prototype.slice.call(fields);
      fieldsArray.forEach(function (currentEl, index, array) {
        currentEl.value = "";
      });
      fieldsArray[0].focus(); //set the focus on the first element of the array
    },
    displayBudget: function displayBudget(obj) {
      var type;
      obj.budget > 0 ? type = "inc" : type = "exp";
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, "inc");
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, "exp");

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "--";
      }
    },
    displayPercentages: function displayPercentages(percentages) {
      var fields;
      fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel); // return node list

      nodeListForEach(fields, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      }); // .forEach function for node list
    },
    displayMonth: function displayMonth() {
      var currentDay, currentMonth, currentYear, months;
      months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      currentDay = new Date();
      currentYear = currentDay.getFullYear();
      currentMonth = currentDay.getMonth();
      document.querySelector(DOMstrings.dateLabel).textContent = months[currentMonth] + " " + currentYear;
    },
    changeType: function changeType() {
      var fields = document.querySelectorAll(DOMstrings.inputType + "," + DOMstrings.inputDescription + "," + DOMstrings.inputValue);
      nodeListForEach(fields, function (current) {
        current.classList.toggle("red-focus");
      });
      document.querySelector(DOMstrings.inputBTN).classList.toggle("red");
    },
    getDOMstrings: function getDOMstrings() {
      return DOMstrings; //expose to public
    }
  };
}(); //GLOBAL APP CONTROLLER


var controller = function (budgetCtrl, UICtrl) {
  var setUpEventListeners = function setUpEventListeners() {
    var DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.inputBTN).addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
    document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);
    document.querySelector(DOM.inputType).addEventListener("change", UICtrl.changeType);
  };

  var updateBudget = function updateBudget() {
    //1.Calculate the budget
    budgetCtrl.calculateBudget(); //2.Return the budget

    var budget = budgetCtrl.getBudget(); //3.Display the budget on the UI

    UICtrl.displayBudget(budget);
  };

  var updatePercentages = function updatePercentages() {
    //1.Calculate the percentages
    budgetCtrl.calculatePercentages(); //2.read percentages from budget controller

    var percentages = budgetCtrl.getPercentages(); //3.Update the UI with the new percentages

    UICtrl.displayPercentages(percentages);
  };

  var ctrlAddItem = function ctrlAddItem() {
    var input, newItem; //1.Get the field input data

    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      //2.Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value); //3.Add the item to UI

      UICtrl.addListItem(newItem, input.type); //3.1 Clear the fields

      UICtrl.clearFields(); //4. Calculate and update budget

      updateBudget(); //5. Calculate and update percentages

      updatePercentages();
    }
  };

  var ctrlDeleteItem = function ctrlDeleteItem(event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]); //1. Delete the item from the data structure

      budgetCtrl.deleteItem(type, ID); //2. Delete the item from the UI

      UICtrl.deleteListItem(itemID); //3. Update and show the new budget

      updateBudget(); //4.Calculate and update percentages

      updatePercentages();
    }
  };

  return {
    init: function init() {
      //runs each time that app starts
      console.log("Application has started");
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setUpEventListeners();
    }
  };
}(budgetController, UIController);

controller.init();