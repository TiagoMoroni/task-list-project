namespace TaskListAPI.Models
{
    public class TaskModel
    {
        public int? id { get; set; }
        public string? description { get; set; }
        public DateTime? creationDate { get; set; }
        public DateTime? completionDate { get; set;}
        public DateTime? dueDate { get; set; }
        public int? duration { get; set; }
    }
}
