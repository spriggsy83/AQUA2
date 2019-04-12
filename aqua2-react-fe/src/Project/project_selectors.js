export const getStateSlice = (state) => state.project;

export const getHasLoaded = (state) => state.project.loaded;
export const getIsLoading = (state) => state.project.loading;
export const getError = (state) => state.project.error;
export const getProjectObj = (state) => state.project.project;
