export type ProjectStatus = "Pending" | "Active" | "Finished"
export type UserRole = "Architect" | "Engineer" | "Developer"

export interface IProject {
  name: string;
  description: string;
  status: ProjectStatus;
  userRole: UserRole;
  finishDate: Date;
  owner: string; // UID del usuario que creó el proyecto
  collaborators: string[]; // UIDs de otros usuarios en el proyecto
}

export class Project implements IProject {
  name!: string;
  description!: string;
  status!: "Pending" | "Active" | "Finished";
  userRole!: "Architect" | "Engineer" | "Developer";
  finishDate!: Date;
  owner!: string;
  collaborators!: string[];
  id: string;

  constructor(data: IProject, id: string) {
    this.name = data.name;
    this.description = data.description;
    this.status = data.status;
    this.userRole = data.userRole;
    this.finishDate = data.finishDate;
    this.owner = data.owner;
    this.collaborators = data.collaborators || [];
    this.id = id;
  }
}