import { createContext, useContext } from "solid-js";
import type { ProjectStore } from "~/ui/project-store";

/**
 * Solid context that carries the {@link ProjectStore} down the tree. Components
 * read it via {@link useProject} rather than importing the store directly, so
 * tests and storybooks can inject their own.
 */
export const ProjectContext = createContext<ProjectStore>();

/**
 * Returns the nearest {@link ProjectStore} from context.
 * @throws when called outside a {@link ProjectContext.Provider}.
 */
export function useProject(): ProjectStore {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error("useProject must be called inside a <ProjectContext.Provider>");
  }

  return ctx;
}
