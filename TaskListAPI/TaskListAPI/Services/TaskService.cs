using TaskListAPI.Models;

namespace TaskListAPI.Services
{
    public class TaskService : ITaskService
    {
        private readonly IDbService _dbService;

        public TaskService(IDbService dbService)
        {
            _dbService = dbService;
        }

        public async Task<bool> CreateTask(TaskModel task)
        {
            var result =
                await _dbService.EditData(
                    "INSERT INTO public.task (description, creation_date, completion_date, due_date, duration) VALUES (@description, @creationDate, @completionDate, @dueDate, @duration)",
                    task);
            return true;
        }

        public async Task<List<TaskModel>> GetTaskList()
        {
            var taskList = await _dbService.GetAll<TaskModel>("SELECT * FROM public.task", new { });
            return taskList;
        }


        public async Task<TaskModel> GetTask(int id)
        {
            var taskList = await _dbService.GetAsync<TaskModel>("SELECT * FROM public.task where id=@id", new { id });
            return taskList;
        }

        public async Task<TaskModel> UpdateTask(TaskModel task)
        {
            var updateTask =
                await _dbService.EditData(
                    "Update public.task SET description=@description, completion_date=@completionDate, due_date=@dueDate, duration=@duration WHERE id=@id",
                    task);
            return task;
        }

        public async Task<bool> DeleteTask(int id)
        {
            var deleteTask= await _dbService.EditData("DELETE FROM public.task WHERE id=@id", new { id });
            return true;
        }
    }
}
