/*jshint esversion: 6 */
$(function() {

// VIEWs

const taskList = function(tasks) { 
  return `<h1>Task list</h1>
  <button class="new">New task</button>
  <button class="reset">Reset tasks</button>
  <button class="active">${active ? 'All' : 'Active'} Tasks</button>
  <p/>
  <input type="text" class="search" value="${search}" placeholder="Search" name="filter" onfocus="let v=this.value; this.value=''; this.value=v">
  <img class="clear" src="public/icon_delete.png" />
  <p/>
  Order: <button class="order">${order ? 'ASC' : 'DESC'}</button>
  ` +
  tasks.reduce(
    (ac, task) => ac += 
    `<div>
    <button type="submit" class="delete" taskid="${task.id}" title="Delete"> <img src="public/icon_delete.png"/> </button>
    <button type="button" class="edit"   taskid="${task.id}" title="Edit"  > <img src="public/icon_edit.png"/> </button>
    <button type="button" class="switch" taskid="${task.id}" title=${task.done ? 'Start' : 'Stop'}> <img src="${task.done ? 'public/icon_play.png' : 'public/icon_stop.png'}"/> </button>
    ${task.title}
    </div>\n`, 
    "");
};

const taskForm = function(msg, id, action, title, done) {
  return `<h1>Task form</h1>
  ${msg}: <p class="form">
  <input type="text"     name="title"  value="${title}" placeholder="title"/>
  Done: 
  <input type="checkbox" name="done"   ${done ? 'checked' : ''}/>
  <button class="${action}" taskid="${id}">${action}</button>
  </p>
  <button class="list">Go back</button>
  `;
};


// CONTROLLERs

const listController = function() {
  Cookie.set("active", JSON.stringify(active), 7);
  Cookie.set("search", JSON.stringify(search), 7);
  Cookie.set("order", JSON.stringify(order), 7); 
  let where = {};
  if(active)
    where.done = false;
  if(search)
    where.title=["includes",search];

  $('#tasks').html(taskList(task_model.getAll(where,{'title' : order})));
};

const newController = function() {
  $('#tasks').html(taskForm('New task', null, 'create', '', ''));
};

const editController = function(id) {
  let task = task_model.get(id);
  $('#tasks').html(taskForm('Edit task', id, 'update', task.title, task.done));
};

const createController = function() {
  task_model.create($('input[name=title]').val(), $('input[name=done]').is(':checked'));  
  listController();
};

const updateController = function(id) {
  task_model.update(id, $('input[name=title]').val(), $('input[name=done]').is(':checked'));
  listController();
};

const switchController = function(id) {
 let task = task_model.get(id);
  task_model.update(id, task.title, !task.done);
  listController();
};

const deleteController = function(id) {
 task_model.delete(id);
  listController();
};

const resetController = function() {
 task_model.reset();
  listController();
};


// ROUTER

const eventsController = function() {
  $(document).on('click','.list',   () => listController());
  $(document).on('click','.active', () => {active = !active; listController()});
  $(document).on('click','.clear', () => {search = ""; listController()});
  $(document).on('click','.order', () => {order = !order; listController()});
  $(document).on('click','.new',    () => newController());
  $(document).on('click','.edit',   (e)=> editController(Number($(e.currentTarget).attr("taskid"))));
  $(document).on('click','.create', () => createController());
  $(document).on('click','.update', (e)=> updateController(Number($(e.currentTarget).attr("taskid"))));
  $(document).on('click','.switch', (e)=> switchController(Number($(e.currentTarget).attr("taskid"))));
  $(document).on('click','.delete', (e)=> deleteController(Number($(e.currentTarget).attr("taskid"))));
  $(document).on('click','.reset',  (e)=> resetController());
  $(document).on('input','.search',  ()=> {search = $(".search").val(); listController(); $(".search").focus()});
  $(document).on('keypress','.form',  (e)=> {if (e.keyCode === 13) $("button[type=submit]").trigger("click");})


};


/*let active = false;
let search = "";
let order = true;*/

active = Cookie.get("active") ? JSON.parse(Cookie.get("active")) : false;
search = Cookie.get("search") ? JSON.parse(Cookie.get("search")) : "";
order = Cookie.get("order") ? JSON.parse(Cookie.get("order")) : true;


let task_model = new TaskModel();
listController();
eventsController();
});
