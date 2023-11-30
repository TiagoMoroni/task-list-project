export class Task{
    id: number
    description: string
    creationDate: Date 
    completionDate?: Date
    dueDate: Date
    duration?: number

    constructor(id: number, description: string, creationDate: Date, completionDate: Date, dueDate: Date, duration: number) {
        this.id = id
        this.description = description
        this.creationDate = creationDate
        this.completionDate = completionDate
        this.dueDate = dueDate
        this.duration = duration
    }
}