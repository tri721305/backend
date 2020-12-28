export const parameterIdValidation = (paramId: any): number => {
  if (!isNaN(paramId)) {
    return Number(paramId);
  } else {
    throw 'Bad request';
  }
};
