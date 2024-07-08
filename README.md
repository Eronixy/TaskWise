**This project was created in partial fulfillment of the COSC 203: Design and Analysis of Algorithms course.**

Instructor: Sir Chris Piamonte

Group 2 Members:
- Salvador Jr. S. Bibat
- Irron Jovic Jun V. Brosoto
- Niñalene G. Paguio
- Audric Gwyn M. Teel

# TaskWise

TaskWise is a web-based task scheduling application designed to help users optimize their weekly schedules. By allowing users to input tasks with various attributes such as priority and energy levels, TaskWise generates an optimal schedule that maximizes productivity based on user-defined criteria.

## Features

- Interactive weekly schedule grid
- Customizable working hours
- Task management system with priority and energy level inputs
- Optimal schedule generation using a knapsack algorithm
- Choice of optimization criteria
- Visual representation of scheduled tasks with color coding
- Developer mode for quick task generation and testing

## Installation

Create a new tab and use the URL: https://eronixy.github.io/TaskWise/

No additional installation or server setup is required as TaskWise runs entirely in the browser.

## Usage

### Customize Schedule Hours:

Click the "Customize Hours" button.
Set your preferred start and end times for the schedule.
Click "Apply" to update the schedule grid.

###  Add Tasks:
Click the "Add Tasks" button.
For each task, provide:

Task Name
Priority Level (1-5)
Energy Value (1-5)
Time required (in hours)

Click "Add Another Task" to input multiple tasks.

### Set Optimization Criterion:

Choose "Priority Level" or "Energy Value" from the dropdown menu.

### Generate Schedule:

After adding all tasks, click "Generate Schedule".
The application will create an optimal schedule based on your inputs.

The generated schedule will be displayed on the grid.
Each task is color-coded for easy identification.
Any unscheduled tasks will be listed in a popup.

### Reset Schedule:

Click "Reset Schedule" to clear the current schedule and start over.

## For Developers

TaskWise includes a **developer mode** for testing and demonstration purposes:

Click the "Dev Mode" button.
Enter the desired number of tasks to generate.
Click "Generate Tasks" to create random tasks with varying attributes.

This feature is useful for quickly populating the task list and testing the scheduling algorithm with different scenarios.

## Performance
The schedule generation algorithm has a time complexity of O(2^n), where n is the number of tasks. For a small number of tasks (typically less than 22), the performance should be acceptable on modern browsers. However, as the number of tasks increases, the generation time may become noticeable.

## Limitations and Future Improvements

Current implementation does not support saving schedules or tasks between sessions.
The algorithm may become slow with a large number of tasks.

Future versions could include:

- Backend integration for data persistence
- More advanced scheduling algorithms for improved performance
- Drag-and-drop interface for manual task arrangement
- Integration with calendar applications
