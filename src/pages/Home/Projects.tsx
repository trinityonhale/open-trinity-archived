import { useEffect, useState } from "react";
import { ProjectCard } from "../../components/ProjectCard";
import { getProjects } from "../../firebase/dao";
import { DocumentData } from "firebase/firestore";
import { SimpleGrid, GridCol } from "@mantine/core";

export default function Projects() {
  const [projects, setProjects] = useState<DocumentData[]>([]);

  useEffect(() => {
    getProjects().then((projects) => {
      setProjects(projects.docs);
    });
  }, []);

  return (
    <SimpleGrid spacing="md">
      {projects.map((project: DocumentData) => (
        <ProjectCard
          key={project.id}
          project={{ ...project.data(), id: project.id }}
        />
      ))}
    </SimpleGrid>
  );
}
