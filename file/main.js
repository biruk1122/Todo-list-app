//wait for the page to fully load before running the script
window.addEventListener("load", () => {
  //get reference to the form element
  const form = document.querySelector("#new-task-form")

  //get reference where the input field where user types a new task
  const input = document.querySelector("#new-task-input")

  //get reference to the container where all tasks will be displayed
  const list_element = document.querySelector("#tasks")

  //load tasks from localstorage if available, otherwise use an empty array
  let tasks = JSON.parse(localStorage.getItem("tasks")) || []

  //function to save the current list of tasks to localstorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }

  //function to create a new task element and add it to the dom
  function createTaskElement(taskText) {
    //create a container div for the task
    const task_element = document.createElement("div")
    task_element.classList.add("task")

    //create a div to hold the task content
    const task_content_element = document.createElement("div")
    task_content_element.classList.add("content")
    task_element.appendChild(task_content_element)

    //create the input element to display the task text
    const task_input_element = document.createElement("input")
    task_input_element.classList.add("text")
    task_input_element.type = "text"
    task_input_element.value = taskText
    task_input_element.setAttribute("readonly", "readonly")
    task_content_element.appendChild(task_input_element)

    //create a div for the action buttons (edit, delete)
    const task_action_element = document.createElement("div")
    task_action_element.classList.add("action")

    //create the "Edit" button
    const task_edit_element = document.createElement("button")
    task_edit_element.classList.add("edit")
    task_edit_element.innerHTML = "Edit"

    //create the "Delete" button
    const task_delete_element = document.createElement("button")
    task_delete_element.classList.add("delete")
    task_delete_element.innerHTML = "Delete"

    //add both buttons to the action container
    task_action_element.appendChild(task_edit_element)
    task_action_element.appendChild(task_delete_element)

    //add the action container to the task element
    task_element.appendChild(task_action_element)

    //add the full task element to the main task list in the dom
    list_element.appendChild(task_element)

    //handle the "Edit" button click
    task_edit_element.addEventListener("click", () => {
      if (task_edit_element.innerText.toLowerCase() == "edit") {
        //switch to editable mode
        task_input_element.removeAttribute("readonly")
        task_input_element.focus()
        task_edit_element.innerText = "save"
      } else {
        //save the changes and make input read-only again
        task_input_element.setAttribute("readonly", "readonly")
        task_edit_element.innerText = "Edit"

        //update the task in the tasks array and save to localstorage
        const index = tasks.indexOf(taskText)
        if (index !== -1) {
          tasks[index] = task_input_element.value
          saveTasks()
        }
      }
    })

    //handle the "Delete" button click
    task_delete_element.addEventListener("click", () => {
      //remove the task element from the dom
      list_element.removeChild(task_element)
      //remove the task from the array and save
      tasks = tasks.filter((t) => t !== task_input_element.value)
      saveTasks()
    })
  }

  //Re-create task element from the tasks load from localstorage
  tasks.forEach((task) => {
    createTaskElement(task)
  })

  //handel form submission to add a new task
  form.addEventListener("submit", (e) => {
    e.preventDefault() //prevent the page from refreshing

    //get and trim task text
    const task = input.value.trim()

    //if empty, alert and stop
    if (!task) {
      alert("please fill out the task")
      return
    }

    //add the new task to the array, save it, and create its element
    tasks.push(task)
    saveTasks()
    createTaskElement(task)

    //clear the input field
    input.value = ""
  })
})
