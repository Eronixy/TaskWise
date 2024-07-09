document.addEventListener("DOMContentLoaded", function() {
	const gridContainer = document.querySelector(".grid-container");
	const totalTimeDisplay = document.getElementById("total-time");
	const customizeButton = document.getElementById("customize-button");
	const addTasksButton = document.getElementById("add-tasks-button");
	const customizePopup = document.getElementById("customize-popup");
	const addTasksPopup = document.getElementById("add-tasks-popup");
	const successPopup = document.getElementById("success-popup");
	const closeButtons = document.querySelectorAll(".close-button");
	const customizeForm = document.getElementById("customize-form");
	const tasksForm = document.getElementById("tasks-form");
	const addTaskButton = document.getElementById("add-task");
	const tasksContainer = document.getElementById("tasks-container");
	const executionTimeDisplay = document.getElementById("execution-time");
	const devModeButton = document.getElementById("dev-mode-button");
	const devModePopup = document.getElementById("dev-mode-popup");
	const devModeForm = document.getElementById("dev-mode-form");
	const resetButton = document.getElementById("reset-button");

	let totalFreeTime = 0;
	let isMouseDown = false;
	let toggleState = null;

	const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	let startHour = 8;
	let endHour = 22;
	const intervalsInHour = 2;

	customizeButton.addEventListener("click", () => {
		customizePopup.style.display = "block";
	});

	addTasksButton.addEventListener("click", () => {
		addTasksPopup.style.display = "block";
	});

	devModeButton.addEventListener("click", () => {
		devModePopup.style.display = "block";
	});

	closeButtons.forEach(button => {
		button.addEventListener("click", () => {
			button.closest(".popup").style.display = "none";
		});
	});

	window.addEventListener("click", (event) => {
		if (event.target == customizePopup) {
			customizePopup.style.display = "none";
		}
		if (event.target == addTasksPopup) {
			addTasksPopup.style.display = "none";
		}
		if (event.target == successPopup) {
			successPopup.style.display = "none";
		}
		if (event.target == devModePopup) {
			devModePopup.style.display = "none";
		}
	});

	customizeForm.addEventListener("submit", (event) => {
		event.preventDefault();
		startHour = parseInt(document.getElementById("start-hour").value);
		endHour = parseInt(document.getElementById("end-hour").value);
		clearGrid();
		generateGrid();
		customizePopup.style.display = "none";
	});

	tasksForm.addEventListener("submit", (event) => {
		event.preventDefault();
		const tasks = [];
		document.querySelectorAll(".task").forEach(task => {
			tasks.push({
				name: task.querySelector('[name="task-name"]').value,
				priority: parseInt(task.querySelector('[name="priority-level"]').value),
				energy: parseInt(task.querySelector('[name="energy-value"]').value),
				time: parseFloat(task.querySelector('[name="task-time"]').value) * 2 // converting to half-hours
			});
		});

		const criterion = document.getElementById("optimization-criterion").value;
		const freeTimeSlots = document.querySelectorAll(".grid-item.free").length;
		const startTime = performance.now();
		const {
			schedule,
			unscheduledTasks
		} = generateOptimalSchedule(tasks, freeTimeSlots, criterion);
		const endTime = performance.now();
		const executionTime = endTime - startTime;
		displaySchedule(schedule, criterion);
		displayUnscheduledTasks(unscheduledTasks);
		executionTimeDisplay.textContent = `Execution Time: ${executionTime.toFixed(2)} milliseconds`;
		successPopup.style.display = "block";
	});


	addTaskButton.addEventListener("click", () => {
		const taskDiv = document.createElement("div");
		taskDiv.classList.add("task");
		taskDiv.innerHTML = `
            <label for="task-name">Task Name:</label>
            <input type="text" name="task-name" required>
            <label for="priority-level">Priority Level:</label>
            <input type="number" name="priority-level" min="1" max="5" required>
            <label for="energy-value">Energy Value:</label>
            <input type="number" name="energy-value" min="1" max="5" required>
            <label for="task-time">Time (hours):</label>
            <input type="number" name="task-time" step="0.5" min="0.5" required>
            <button type="button" class="delete-button">Delete Task</button>
        `;
		tasksContainer.appendChild(taskDiv);
		addDeleteTaskListener(taskDiv.querySelector(".delete-button"));
	});

	devModeForm.addEventListener("submit", (event) => {
		event.preventDefault();

		const numTasks = parseInt(document.getElementById("num-tasks").value);

		tasksContainer.innerHTML = '';

		for (let i = 0; i < numTasks; i++) {
			const taskContainer = document.createElement("div");
			taskContainer.classList.add("task");

			const randomHours = (Math.floor(Math.random() * 12) + 1) * 0.5;
			const randomPriority = Math.floor(Math.random() * 5) + 1;
			const randomEnergy = Math.floor(Math.random() * 5) + 1;

			taskContainer.innerHTML = `
                <label for="task-name">Task Name:</label>
                <input type="text" name="task-name" value="Task ${i+1}" required>
                <label for="priority-level">Priority Level:</label>
                <input type="number" name="priority-level" min="1" value="${randomPriority}" required>
                <label for="energy-value">Energy Value:</label>
                <input type="number" name="energy-value" min="1" value="${randomEnergy}" required>
                <label for="task-time">Time (hours):</label>
                <input type="number" name="task-time" step="0.5" min="0.5" value="${randomHours}" required>
                <button type="button" class="delete-button">Delete Task</button>
            `;
      
			tasksContainer.appendChild(taskContainer);
			addDeleteTaskListener(taskContainer.querySelector(".delete-button"));
		}

		devModePopup.style.display = "none";
	});

	function addDeleteTaskListener(deleteButton) {
		deleteButton.addEventListener("click", () => {
			deleteButton.parentElement.remove();
		});
	}
	
	resetButton.addEventListener("click", () => {
		totalFreeTime = 0;
		updateTotalTime();
		clearGrid();
		generateGrid();
	});


    function generateGrid() {
        const gridRows = (((endHour - startHour) + 1) * intervalsInHour);
        const gridColumns = daysOfWeek.length + 1;

        gridContainer.style.gridTemplateRows = `repeat(${gridRows}, auto)`;
        gridContainer.style.gridTemplateColumns = `auto repeat(${daysOfWeek.length}, 1fr)`;
        
        const cornerHeader = document.createElement("div");
        cornerHeader.classList.add("grid-header");
        cornerHeader.style.gridRow = 'span 2';
        cornerHeader.style.gridColumn = '1';
        gridContainer.appendChild(cornerHeader);
    
        daysOfWeek.forEach((day, index) => {
            const dayHeader = document.createElement("div");
            dayHeader.classList.add("grid-header");
            dayHeader.textContent = day;
            dayHeader.style.gridRow = '1 / span 2';
            dayHeader.style.gridColumn = (index + 2).toString();
            gridContainer.appendChild(dayHeader);
        });
        
        for (let hour = startHour; hour < endHour; hour++) {
            const labelCell = document.createElement("div");
            labelCell.classList.add("grid-label");
            labelCell.textContent = `${hour}:00 - ${hour + 1}:00`;
            labelCell.style.gridRow = `span ${intervalsInHour}`;
            gridContainer.appendChild(labelCell);
        }

        for (let hour = startHour; hour < endHour; hour++) {
            daysOfWeek.forEach(day => {
                for (let interval = 0; interval < intervalsInHour; interval++) {
                    const cell = document.createElement("div");
                    cell.classList.add("grid-item");
                    cell.dataset.day = day;
                    cell.dataset.hour = hour;
                    cell.dataset.interval = interval;
                    cell.addEventListener("mousedown", onMouseDown);
                    cell.addEventListener("mouseover", onMouseOver);
                    cell.addEventListener("mouseup", onMouseUp);
                    gridContainer.appendChild(cell);
                }
            });
        }
    }
    
  function clearGrid() {
	while (gridContainer.firstChild) {
		gridContainer.removeChild(gridContainer.firstChild);
	}
}
    
	document.addEventListener("mouseup", () => {
		isMouseDown = false;
		toggleState = null;
	});

	function onMouseDown(event) {
		const cell = event.target;
		isMouseDown = true;
		toggleState = !cell.classList.contains("free");
		toggleCellState(cell, toggleState);
	}

	function onMouseOver(event) {
		if (isMouseDown) {
			const cell = event.target;
			toggleCellState(cell, toggleState);
		}
	}

	function onMouseUp(event) {
		isMouseDown = false;
		toggleState = null;
	}

	function toggleCellState(cell, state) {
		if (state) {
			if (!cell.classList.contains("free")) {
				cell.classList.add("free");
				totalFreeTime++;
			}
		} else {
			if (cell.classList.contains("free")) {
				cell.classList.remove("free");
				totalFreeTime--;
			}
		}
		updateTotalTime();
	}

	function updateTotalTime() {
		const hours = Math.floor(totalFreeTime / 2);
		const minutes = (totalFreeTime % 2) * 30;
		totalTimeDisplay.textContent = `Total Free Time: ${hours} hours ${minutes} minutes`;
	}

	function generateOptimalSchedule(tasks, capacity, criterion) {
		const n = tasks.length;
		let bestValue = 0;
		let bestCombination = [];

		const getValue = (task) => criterion === 'priority' ? task.priority : task.energy;

		for (let i = 0; i < (1 << n); i++) {
			let totalWeight = 0;
			let totalValue = 0;
			let combination = [];
			for (let j = 0; j < n; j++) {
				if (i & (1 << j)) {
					totalWeight += tasks[j].time;
					totalValue += getValue(tasks[j]);
					combination.push(tasks[j]);
				} 
			}
			if (totalWeight <= capacity && totalValue > bestValue) {
				bestValue = totalValue;
				bestCombination = combination;
			}
		}
		const scheduledTaskNames = new Set(bestCombination.map(task => task.name));
		const unscheduledTasks = tasks.filter(task => !scheduledTaskNames.has(task.name));
		return {
			schedule: bestCombination,
			unscheduledTasks
		};
	}

  function displaySchedule(schedule, criterion) {
  	const freeCells = Array.from(document.querySelectorAll(".grid-item.free"));
  	freeCells.forEach(cell => cell.classList.remove("task"));
  
  	schedule.sort((a, b) => criterion === 'priority' ? b.priority - a.priority : b.energy - a.energy);

  	schedule.forEach(task => {
  		let timeRemaining = task.time;
  		let taskColor = getRandomColor();
  		for (let i = 0; i < freeCells.length && timeRemaining > 0; i++) {
  			const cell = freeCells[i];
  			if (!cell.classList.contains("scheduled-task")) {
  				cell.classList.add("scheduled-task");
  				cell.style.backgroundColor = taskColor;
  				cell.textContent = task.name;
  				timeRemaining--;
  			}
  		}
  	});
  }

	function displayUnscheduledTasks(unscheduledTasks) {
		const unscheduledTasksList = document.getElementById("unscheduled-tasks-list");
		unscheduledTasksList.innerHTML = '';
		unscheduledTasks.forEach(task => {
			const listItem = document.createElement("li");
			listItem.textContent = task.name;
			unscheduledTasksList.appendChild(listItem);
		});
	}

  function getRandomColor() {
    const letters = '89ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}

	generateGrid();
});
