$(document).ready(function(){
  updateTaskList();

  $('#submitNewTask').on('click', addTask);//add button - add task to DOM & SQL table
  $('.taskContainer').on('click', '.delete', removeTask);//delete button - remove from DOM & SQL table
  $('.taskContainer').on('click', '.checkbox', switchStatus);//check box - new or completed task
});
//posting newly added task
function addTask() {
  values={};
  values.task=$('#task').val();

  $.ajax({
    type: 'POST',
    url: '/task',
    data: values,
    success: function(){
      updateTaskList();
    }
  });
}
//appending newly added task to dom inside new tasks #newTasksContainer div
function appendNewTask() {
  $.ajax({
    type: 'GET',
    url: '/task/newtask',
    success: function(data){
      for (var i = 0; i < data.length; i++) {
        $('#newTasksContainer').append(
          '<div class="newTaskLine"><input data-id="' + data[i].id +
          '" class="checkbox" type="checkbox" name="complete' + [i] +
          '"><p class="tasks">' + data[i].task +
          '</p><button data-id="' + data[i].id +
          '" class="delete">DELETE</button></div>');
      }
    }
  });
}
//if check box is clicked - task status switches from false to true - moving the task
//into the completed task list
function switchStatus() {
  var values = {};
  values.id = $(this).data('id');

  if ($(this).is(':checked')) {
    values.complete = true;
  } else {
    values.complete = false;
  }

  $.ajax({
    type: 'POST',
    url: 'task/switch',
    data: values,
    success: function(){
      updateTaskList();
    }
  });
}
//appending completed task (box-checked) to DOM inside completed tasks #completed Tasks div
//boolean value = true
function appendCompletedTask() {
  $.ajax({
    type: 'GET',
    url: '/task/completedtask',
    success: function(data){
      for (var i = 0; i < data.length; i++) {
        $('#completedTasks').append(
          '<div class="completedTaskLine"><input data-id="' + data[i].id +
          '" class="checkbox" type="checkbox" name="complete' + [i] +
          '" checked><p class="completeTasks">' + data[i].task +
          '</p><button data-id="' + data[i].id +
          '" class="delete">DELETE</button></div>');
      }
    }
  });
}
//pop-up prompt - asking if you want to perminantly delete task after clicking delete button -
//if click ok - task permanently deleted from DOM & SQL table
function removeTask() {
  var result = confirm('Permanently delete this task?');
  if (result) {
    var values = {};
    values.id = $(this).data('id');
    console.log($(this).data('id'));

    $.ajax({
      type: 'POST',
      url: 'task/remove',
      data: values,
      success: function () {
        updateTaskList();
      }
    });
  }
}

function updateTaskList() {
  $('.completedTaskLine').remove();
  $('.newTaskLine').remove();
  appendCompletedTask();
  appendNewTask();
}
