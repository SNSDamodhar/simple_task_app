let tasks = [];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
let tasks_completed = 0;
let tasks_pending = 0;

const add_task = document.getElementById('addTask');
const task_search = document.getElementById('search');
const clear_search = document.getElementById('clearSearch');
const events = document.querySelector('.task_items');

//Updating the tasks count when page is loaded
const calculateDashboard = () => {
    tasks.forEach((task) => {
        if(task.status === 'Completed') tasks_completed++;
        else tasks_pending++;
    })
    calculateDashboardUI();
};

//Rendering the tasks count in the UI
const calculateDashboardUI = () => {
    document.getElementById('pendingCount').textContent = `Pending Tasks: ${tasks_pending}`;
    document.getElementById('completedCount').textContent = `Completed Tasks: ${tasks_completed}`;
}


//Sorting the array based on the date
// const descendingOrder = () => {
//     tasks.sort((currentValue, nextValue) => {
//         const fTime = currentValue.task_date + " " + currentValue.task_time;
//         const sTime = nextValue.task_date + " " + nextValue.task_time;
//         const firstTime = new Date(fTime).getTime();
//         const secondTime = new Date(sTime).getTime();

//         return secondTime - firstTime;
//     })
// }


//Sorting the array based on the date
const descendingOrder = () => {
    tasks.sort((currentValue, nextValue) => {
        const fTime = currentValue.task_date + " " + currentValue.task_time;
        const sTime = nextValue.task_date + " " + nextValue.task_time;
        const firstTime = new Date(fTime);
        const secondTime = new Date(sTime);

        return sortByDateDescAndTimeAscDateObj(firstTime, secondTime);
    })
}

const sortByDateDescAndTimeAscDateObj = function (firstTime, secondTime) {
    let results;

    results = firstTime.getFullYear() < secondTime.getFullYear() ? 
    1 : firstTime.getFullYear() > secondTime.getFullYear() ? -1 : 0;

    if (results === 0)
        results = firstTime.getMonth() < secondTime.getMonth() ? 
        1 : firstTime.getMonth() > secondTime.getMonth() ? -1 : 0;

    if (results === 0)
        results = firstTime.getDate() < secondTime.getDate() ? 
        1 : firstTime.getDate() > secondTime.getDate() ? -1 : 0;

    if (results === 0)
        results = firstTime.getHours() > secondTime.getHours() ? 
        1 : firstTime.getHours() < secondTime.getHours() ? -1 : 0;

    if (results === 0)
        results = firstTime.getMinutes() > secondTime.getMinutes() ? 
        1 : firstTime.getMinutes() < secondTime.getMinutes() ? -1 : 0;

    if (results === 0)
        results = firstTime.getSeconds() > secondTime.getSeconds() ? 
        1 : firstTime.getSeconds() < secondTime.getSeconds() ? -1 : 0;

    return results;
}

//Changing the date format from YYYY-MM-DD to DD-MM-YYYY
const dateFormat = (date1) => {
    const date = new Date(date1);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return day + "-" + month + "-" + year;
}

//Changing time format from 24hrs to 12hrs
const timeFormat = (timeString) => {
    let H = +timeString.substr(0, 2);
    let h = H % 12 || 12;
    let ampm = (H < 12 || H === 24) ? "AM" : "PM";
    timeString = h + timeString.substr(2, 3) + " " + ampm;
    return timeString;
}

//Render tasks to the screen
const renderTasks = (tasks) => {
    document.querySelector('.task_items').innerHTML = '';

    const markUp = tasks.map((task, index) => {
        return `
            <div class = "row d-flex justify-content-center text-center task">
                <div class="col-md-2 task_date">
                    ${task.task_date + " : " + task.task_time}
                </div>
                <div class="col-md-6 task_des">
                    <p>
                        ${task.task_desc}
                    </p>
                </div>
                <div class="col-md-1 ">
                    ${task.status}
                </div>
                <div class="col-md-1 completed" data-complete-id = ${index}>
                    ${task.status === 'Pending' ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>'}
                </div>
                <div class="col-md-1 update" data-update-id = ${index}>
                    <i class="fa fa-edit"></i>
                </div>
                <div class="col-md-1 delete" data-delete-id = ${index}>
                    <i class="fa fa-trash"></i>
                </div>
            </div>
        `
    }).join('');
    
    document.querySelector('.task_items').insertAdjacentHTML('afterbegin', markUp);
}

//Adding and Updating the task
add_task.addEventListener('click', (e) => {
    e.preventDefault();

    let task_date = document.getElementById('taskDate').value;
    let task_time = document.getElementById('taskTime').value;
    const task_desc = document.getElementById('taskDesc').value;
    const task_action = document.getElementById('actionType').value;

    if(task_date.length === 0 || task_time.length === 0 || task_desc.length === 0) {
        alert('Date, Time, Task Description are mandatory!');
        return;
    }

    task_date = dateFormat(task_date);
    if(task_time.length <= 5) {
        task_time = timeFormat(task_time);
    }

    if(task_action === 'insert') {
        const task_obj = {
            task_date,
            task_time,
            task_desc,
            status: 'Pending'
        };

        tasks_pending++;
        calculateDashboardUI();

        tasks.push(task_obj);

        descendingOrder();

        localStorage.setItem('tasks', JSON.stringify(tasks));

        document.getElementById('taskDate').value = '';
        document.getElementById('taskTime').value = '';
        document.getElementById('taskDesc').value = '';

        renderTasks(tasks);
    } else if(task_action === 'update') {
        const index = document.getElementById('task_id').value;
        const status = tasks[+index].status;
        
        const task_obj = {
            task_date,
            task_time,
            task_desc,
            status
        };

        tasks.splice(index, 1);
        tasks.push(task_obj);

        descendingOrder();

        localStorage.setItem('tasks', JSON.stringify(tasks));

        document.getElementById('taskDate').value = '';
        document.getElementById('taskTime').value = '';
        document.getElementById('taskDesc').value = '';
        document.getElementById('actionType').value = 'insert';
        document.getElementById('task_id').value = '';

        renderTasks(tasks);
    }
});


//Adding Events to the icons
events.addEventListener('click', (e) => {
    const target = e.target.closest('div');
    
    if(!target) return;

    if(target.classList.contains('delete')) {
        const index = target.dataset.deleteId;
        const status = tasks[index].status;
        tasks.splice(index,1);

        if(status === 'Completed') tasks_completed--;
        else tasks_pending--;

        calculateDashboardUI();

        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(tasks);
    } else if(target.classList.contains('update')) {
        const index = target.dataset.updateId;
        
        const selected_task = tasks[index];

        document.getElementById('taskDate').value = selected_task.task_date;
        document.getElementById('taskTime').value = selected_task.task_time;
        document.getElementById('taskDesc').value = selected_task.task_desc;
        document.getElementById('actionType').value = 'update';
        document.getElementById('task_id').value = +index;

        document.getElementById('taskDesc').focus();
    } else if(target.classList.contains('completed')) {
        const index = target.dataset.completeId;
        if (tasks[index].status === 'Completed') {
            tasks[index].status = 'Pending';
            tasks_completed--;
            tasks_pending++;
            calculateDashboardUI();
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } else {
            tasks[index].status = 'Completed';
            tasks_completed++;
            tasks_pending--;
            calculateDashboardUI();
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
        renderTasks(tasks);
    }

});

//It will return list of tasks between 2 given dates
const tasksBetweenTwoDates = (dateFrom, dateTo, array) => {
    dateFrom = new Date(dateFrom).getTime();
    dateTo = new Date(dateTo).getTime();
    const newArray = array.filter((task) => {
        const task_time = new Date(task.task_date + " " + task.task_time).getTime()
        if(dateFrom <= task_time && task_time <= dateTo) return true;
    });
    return newArray;
};

//It will return all pending tasks
const pendingTasks = (array) => {
    const newArray = array.filter((task) => {
        if(task.status === 'Pending') return true;
    });
    return newArray;
};

//It will return all completed tasks
const completedTasks = (array) => {
    const newArray = array.filter((task) => {
        if(task.status === 'Completed') return true;
    });
    return newArray;
}

//Implemented search logic
task_search.addEventListener('click', (e) => {
    e.preventDefault();

    let dateFrom = document.getElementById('from').value;
    let dateTo = document.getElementById('to').value;
    let checkBoxes = document.querySelectorAll('#status');

    if((dateFrom.length > 0 && dateTo.length === 0) || (dateFrom.length === 0 && dateTo.length > 0)) {
        alert('By giving From/To date is given, respective To/From date should be given');
        return;
    }

    if(new Date(dateFrom).getTime() > new Date(dateTo).getTime()) {
        alert(`'From' date should not be greater than 'To' date`);
        return;
    }


    if(dateFrom.length > 0 && dateTo.length > 0) {
        dateFrom = dateFrom.split('T');
        dateFrom_date = dateFormat(dateFrom[0]);
        dateFrom_time = timeFormat(dateFrom[1]);
        dateFrom = dateFrom_date + " " + dateFrom_time;
    
        dateTo = dateTo.split('T');
        dateTo_date = dateFormat(dateTo[0]);
        dateTo_time = timeFormat(dateTo[1]);
        dateTo = dateTo_date + " " + dateTo_time;
    }

    let pending = false, completed = false;

    checkBoxes.forEach((checkbox) => {
        if(checkbox.value === 'Pending' && checkbox.checked) {
            pending = true;
        } else if(checkbox.value === 'Completed' && checkbox.checked) {
            completed = true;
        }
    })


    if ((dateFrom === '' && dateTo === '' && !pending && !completed) || (dateFrom === '' && dateTo === '' && pending && completed)) {
        //From and To date is not given and both Status are given or not, we can simply return because we are having all the tasks in UI itself
        return;
    } else if((dateFrom !== '' && dateTo !== '' && pending && completed) || (dateFrom !== '' && dateTo !== '' && !pending && !completed)) {
        //From and To date is given and Status is given or not, we can give all records between 2 dates
        console.log('Completed and Pending tasks between date range');
        const newArray = tasksBetweenTwoDates(dateFrom, dateTo, tasks);
        if(newArray.length === 0) {
            alert('No tasks are found for the search criteria!');
            return;
        }
        renderTasks(newArray);
    } else if(dateFrom !== '' && dateTo !== '' && pending && !completed){
        //We need to return all pending records between given 2 dates
        console.log('Pending tasks between date range');
        const newArray = pendingTasks(tasksBetweenTwoDates(dateFrom, dateTo, tasks));
        if(newArray.length === 0) {
            alert('No tasks are found for the search criteria!');
            return;
        }
        renderTasks(newArray);
    } else if(dateFrom !== '' && dateTo !== '' && completed && !pending) {
        //We need to return all completed records between given 2 dates
        console.log('Completed tasks between date range');
        const newArray = completedTasks(tasksBetweenTwoDates(dateFrom, dateTo, tasks));
        if(newArray.length === 0) {
            alert('No tasks are found for the search criteria!');
            return;
        }
        renderTasks(newArray);
    } else if(dateFrom === '' && dateTo === '' && pending && !completed) {
        //We need to return all pending records
        console.log('Only Pending tasks');
        const newArray = pendingTasks(tasks);
        if(newArray.length === 0) {
            alert('No tasks are found for the search criteria!');
            return;
        }
        renderTasks(newArray);
    } else if(dateFrom === '' && dateTo === '' && completed && !pending) {
        //We need to give all completed records
        console.log('Only Completed tasks');
        const newArray = completedTasks(tasks);
        if(newArray.length === 0) {
            alert('No tasks are found for the search criteria!');
            return;
        }
        renderTasks(newArray);
    }
});

clear_search.addEventListener('click', (e) => {
    e.preventDefault();

    renderTasks(tasks);

    document.getElementById('from').value = '';
    document.getElementById('to').value = '';
    let checkBoxes = document.querySelectorAll('#status');
    checkBoxes.forEach((checkbox) => {
        checkbox.checked = false;
    })
});


//Anonymous function to get data from local storage and render it to UI
(function() {
    if(localStorage.getItem('tasks')) {
        tasks = [...JSON.parse(localStorage.getItem('tasks'))]
        renderTasks(tasks);
    }
    calculateDashboard();
})();
