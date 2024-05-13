import { SubTaskStatus, TaskStatus } from "../constants";
import { DocumentReference, FieldPath, Timestamp } from "firebase/firestore";

export const SCHEMA_VERSION = 1;

// Document ID is a special sentinal FieldPath

export type Project = {
    id?: FieldPath;
    name: string;
    description: string;
    onAirAt?: Timestamp;
    seriesRef?: DocumentReference;
    sprints: number;
};

export type Series = {
    id: FieldPath;
    name: string;
};

export type Task = {
    id?: string;
    name: string;
    sprint: number;
    description: string;
    status: TaskStatus;
    projectRef: DocumentReference;
    // who was assigned to this task
    participantRef: DocumentReference[];
    teamRef?: DocumentReference;
    // computed
    taskCount?: number;
    completedTaskCount?: number;
    assignedTaskCount?: number;
};

export type Team = {
    id: FieldPath;
    name: string;
    members: DocumentReference[];
};

export type User = {
    id: FieldPath;
    displayName: string;
    photoURL: string;
};

export type SubTask = {
    assignedAt?: Timestamp;
    id?: string;
    name: string;
    description: string;
    assigneeId?: string;
    status: SubTaskStatus;
    taskRef: DocumentReference;

    // computed
    assignee?: User;
};

export type Comment = {
    id: FieldPath;
    content: string;
    authorRef: DocumentReference;
}
