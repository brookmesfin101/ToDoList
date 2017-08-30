
var model = (function(){

    var Task = function(task, category, id)
    {
        this.task = task;
        this.category = category,
        this.id = id;        
    }

    var data = {
        tasks : [],
        categories : []
    }    

    return {
        addTaskToModel: function(input){
            var ID, newTask;

            ID = 0;

            if(data.tasks.length > 0)
            {
                ID = data.tasks[data.tasks.length - 1].id + 1;
            }    

            if(input.category == "Custom Category")
            {
                newTask = new Task(input.task, input.customCategory, ID);                
            }
            else if(input.category == "")
            {
                newTask = new Task(input.task, null, ID);
            }
            else
            {
                newTask = new Task(input.task, input.category, ID);
            }

            data.tasks.push(newTask);
            if(newTask.category != null && !data.categories.includes(newTask.category))
            {
                data.categories.push(newTask.category);
            }

            return newTask;
        },

        addCategoryToModel: function(task)
        {            
            if(task.category != null && !data.categories.includes(task.category))
            {
                data.categories.push(task.category);
            }            
        },

        deleteTaskFromModel: function(id){

            data.tasks.forEach(function(index){
                if(index.id === parseInt(id))
                {
                    data.tasks.splice(index, 1);
                }
            });
        },

        getData: function(){
            return data;
        },

        testing: function(){
            console.log(data.tasks);
            console.log(data.categories);
        }
    }    
})();

var view = (function(){
    var DOMstrings = {
        checkmark: "#checkmark",
        input: ".task_input",
        task : ".task",
        checkSquare : ".check-square",
        taskContainer : ".task_container",
        categoryContainer : ".category-container",
        categoryInput : ".category-input",
        customCategory : "#custom-category"
    };

    return {
        getInput: function(){
            return {
                task : document.querySelector(DOMstrings.input).value,
                category : document.querySelector(DOMstrings.categoryInput).value,
                customCategory : document.querySelector(DOMstrings.customCategory).value
            }                                
        },

        addTaskToUI: function(taskObj){
            var taskHtml;           

            taskHtml = "<div class='task %category%' id='task-%id%'><img class='check-square' src='assets/check-square.svg'/><p>%Task%</p><button><i class='fa fa-times-circle fa-lg add_style' aria-hidden='true'></i></button></div>";
            
            taskHtml = taskHtml.replace("%Task%", taskObj.task);
            if(taskObj.category != null)
            {
                taskHtml = taskHtml.replace("%category%", taskObj.category);
            }
            taskHtml = taskHtml.replace("%id%", taskObj.id);
            document.querySelector(DOMstrings.taskContainer).insertAdjacentHTML('beforeend', taskHtml);
        },

        deleteTaskFromUI: function(taskID){
            var elem = document.getElementById(taskID);
            elem.remove();
        },

        strikeThroughTask: function(event){            
            if(event.target.className == "check-square")
            {                
                if(event.target.parentNode.querySelector("p").className != "strikeThrough")
                {
                    event.target.parentNode.querySelector("p").className += "strikeThrough";
                } 
                else 
                {
                    event.target.parentNode.querySelector("p").className = "";
                }                
            }
        },

        showCustomCategory: function(event){            
            if(event.target.value == "Custom Category")
            {
                event.target.style.marginLeft = "150px";
                document.querySelector(DOMstrings.customCategory).className = "show-custom-category";
            }
            else
            {
                event.target.style.marginLeft = "250px";
                document.querySelector(DOMstrings.customCategory).className = "hide-custom-category";
            }
        },

        addCategoryToUI: function(category){

            var itemsInCatContainer = document.querySelector(DOMstrings.categoryContainer).getElementsByTagName('p');
            var addCategory = true;
            
            if(itemsInCatContainer != null)
            {
                for(var i = 0; i < itemsInCatContainer.length; i++)
                {                    
                    if(itemsInCatContainer[i].outerText == category)
                    {
                        addCategory = false;
                    }
                } 
            }
            
            if(addCategory)
            {
                document.querySelector(DOMstrings.categoryContainer).insertAdjacentHTML('beforeend', "<p class='category-item " + category + "'>" + category + "</p>");
                
                document.querySelector("." + category).addEventListener("click", view.highlightTasks);
                
            }                
        },

        highlightTasks: function(event){
            //console.log(event.srcElement.classList[1]);
            var tasksToHighlight = document.querySelector(DOMstrings.taskContainer).getElementsByClassName(event.srcElement.classList[1]);

            for(var i = 0; i < tasksToHighlight.length; i++)
            {
                tasksToHighlight[i].classList.toggle("highlight");
            }
        },

        clearField: function(){
            document.querySelector(DOMstrings.input).value = null;
            document.querySelector(DOMstrings.customCategory).value = null;
            document.querySelector(DOMstrings.categoryInput).value = "";
            document.querySelector(DOMstrings.input).focus();
        },

        getDOMstrings: function(){
            return DOMstrings;
        }
    }
})();

var controller = (function(model, view){

    var setupEventListeners = function(){
        var DOM = view.getDOMstrings();

        document.querySelector(DOM.checkmark).addEventListener("click", ctrlAddItem);

        document.querySelector(DOM.taskContainer).addEventListener("click", ctrlDeleteItem);
        document.querySelector(DOM.taskContainer).addEventListener("click", view.strikeThroughTask);

        document.querySelector(DOM.categoryInput).addEventListener("change", view.showCustomCategory);        

        /*document.querySelector(DOM.checkSquare).addEventListener*/

        document.addEventListener("keypress", function(event){
            if(event.keyCode == 13)
            {
                ctrlAddItem();                
            }
        });
    }

    var ctrlAddItem = function(){
        var input, newTask;

        input = view.getInput();

        if(input.task != ""){
            newTask = model.addTaskToModel(input);
            
            view.addTaskToUI(newTask);

            if(input.customCategory != null && input.customCategory != "")
            {
                view.addCategoryToUI(input.customCategory);
            }
            else
            {
                view.addCategoryToUI(input.category);
            }            
    
            view.clearField();
        }        
    }

    var ctrlCategoryTree = function(){
        
    }
    
    var ctrlDeleteItem = function(event)
    {
        var taskID, splitID, ID;

        taskID = event.target.parentNode.parentNode.id;

        if(taskID)
        {
            ID = taskID.split("-")[1];
            
            //Delete task from model
            model.deleteTaskFromModel(ID);
    
            //Delete task from view            
            view.deleteTaskFromUI(taskID);
        }        
    }

    return {

        init: function(){
            console.log("Application has started");
            setupEventListeners();
        }
        
    }
})(model, view);

controller.init();
