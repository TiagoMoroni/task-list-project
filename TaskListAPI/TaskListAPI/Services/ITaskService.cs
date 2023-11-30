using TaskListAPI.Models;

namespace TaskListAPI.Services
{
    public interface ITaskService
    {
        Task<bool> CreateTask(TaskModel task);
        Task<List<TaskModel>> GetTaskList();
        Task<TaskModel> GetTask(int id);
        Task<TaskModel> UpdateTask(TaskModel task);
        Task<bool> DeleteTask(int key);
    }
}
