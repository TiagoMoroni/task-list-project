using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TaskListAPI.Models;
using TaskListAPI.Services;
namespace Teste.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TaskController : Controller
    {
        private readonly ITaskService _taskService;

        public TaskController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _taskService.GetTaskList();

            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetTask(int id)
        {
            var result = await _taskService.GetTask(id);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddTask([FromBody] TaskModel task)
        {
            var result = await _taskService.CreateTask(task);

            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateTask([FromBody] TaskModel task)
        {
            var result = await _taskService.UpdateTask(task);

            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var result = await _taskService.DeleteTask(id);

            return Ok(result);
        }
    }
}
