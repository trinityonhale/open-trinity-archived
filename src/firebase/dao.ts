import { db } from "./firebase";
import { Project, SubTask, Task } from "./types";
import {
  doc,
  addDoc,
  getDoc,
  collection,
  DocumentReference,
  getDocs,
  where,
  query,
  FieldPath,
  updateDoc,
  setDoc,
  getCountFromServer,
} from "firebase/firestore";
import { SCHEMA_VERSION } from "./types";
import { User } from "./AuthProvider";

// Projects
export const createProject = async (project: Project) => {
  return await addDoc(collection(db, "projects"), {
    ...project,
    schemaVersion: SCHEMA_VERSION,
  });
};

export const updateProject = async (project: Project) => {
  return await addDoc(collection(db, "projects"), {
    ...project,
    schemaVersion: SCHEMA_VERSION,
  });
};

export const getProjects = async () => {
  return await getDocs(collection(db, "projects"));
};

// tasks
export const createTaskForProject = (task: any, projectId: string) => {
  const newTask: Task = {
    projectRef: doc(db, `projects/${projectId}`),
    name: task.name,
    sprint: task.sprint,
    description: task.description,
    status: "NOT_ASSIGNED",
    participantRef: [],

    // teamRef: undefined,
    taskCount: 0,
    completedTaskCount: 0,
  };
  return addDoc(collection(db, "tasks"), {
    ...newTask,
    schemaVersion: SCHEMA_VERSION,
  });
};

export const getTasksForProject = async (projectId: string) => {
  const projectRef = doc(db, `projects/${projectId}`);
  const q = query(
    collection(db, "tasks"),
    where("projectRef", "==", projectRef)
  );

  const docs = await getDocs(q);

  return Promise.all(
    docs.docs.map(async (docu) => {

      const taskCount = (await getCountFromServer(query(
        collection(db, "subtasks"),
        where("taskRef", "==", docu.ref),
      ))).data().count;

      const completedTaskCount = (await getCountFromServer(query(
        collection(db, "subtasks"),
        where("taskRef", "==", docu.ref),
        where("status", "==", "COMPLETED"),
      ))).data().count;

      const assignedTaskCount = (await getCountFromServer(query(
        collection(db, "subtasks"),
        where("taskRef", "==", docu.ref),
        where("status", "==", "ASSIGNED"),
      ))).data().count;

      return {
        id: docu.id,
        ...(docu.data() as Task),
        taskCount: taskCount,
        completedTaskCount: completedTaskCount,
        assignedTaskCount: assignedTaskCount,
      };
    })
  );
};

export const uploadUserInfo = async (user: User) => {
    console.log(user);
    return await setDoc(doc(db, `users/${user.uid}`), {
        displayName: user.displayName,
        photoURL: user.photoURL,
    });
};

export const getTask = async (taskId: string): Promise<Task> => {
  const data = await getDoc(doc(db, `tasks/${taskId}`));

  return {
    id: data.id,
    name: data.data()!.name,
    sprint: data.data()!.sprint,
    description: data.data()!.description,
    status: data.data()!.status,
    participantRef: data.data()!.participantRef,
    // taskCount: data.data().taskCount,
    // completedTaskCount: data.data().completedTaskCount,
    projectRef: data.data()!.projectRef,
  };
};

// subtask
export const getSubTasksForTask = async (taskId: string) => {
  const taskRef = doc(db, `tasks/${taskId}`);
  const q = query(collection(db, "subtasks"), where("taskRef", "==", taskRef));

  // append user data
  const result = await getDocs(q);

  return Promise.all(
    result.docs.map(async (docu) => {
      const assigneeData = await getDoc(
        doc(db, `users/${docu.data().assigneeId}`)
      );
      const assignee = assigneeData.data();

      return {
        id: docu.id,
        ...(docu.data() as SubTask),
        assignee: {
          id: assignee?.uid,
          photoURL: assignee?.photoURL,
          displayName: assignee?.displayName,
        },
      };
    })
  );
};

export const createSubTaskForTask = (subtask: any, taskId: string) => {
  const newSubTask: SubTask = {
    name: subtask.name,
    description: subtask.description,
    status: "NOT_ASSIGNED",
    taskRef: doc(db, `tasks/${taskId}`),
  };

  console.log(newSubTask);

  return addDoc(collection(db, "subtasks"), {
    ...newSubTask,
    schemaVersion: SCHEMA_VERSION,
  });
};

export const assignSubTaskToUser = async (
  subTaskId: string,
  userId: string
) => {
  return updateDoc(doc(db, `subtasks/${subTaskId}`), {
    assigneeId: userId,
    assignedAt: new Date(),
  }).then(() => {
    updateDoc(doc(db, `subtasks/${subTaskId}`), {
      status: "ASSIGNED",
    });
  });
};

export const unassignSubTask = async (subTaskId: string) => {
  return updateDoc(doc(db, `subtasks/${subTaskId}`), {
    status: "NOT_ASSIGNED",
  }).then(() => {
    updateDoc(doc(db, `subtasks/${subTaskId}`), {
      assigneeId: null,
    });
  });
};

export const markSubTaskAsDone = async (subTaskId: string) => {
  return updateDoc(doc(db, `subtasks/${subTaskId}`), {
    status: "COMPLETED",
  });
};
