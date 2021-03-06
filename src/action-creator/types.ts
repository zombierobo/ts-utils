// Redux actions typed
// Refer https://medium.com/@martin_hotell/improved-redux-type-safety-with-typescript-2-8-2c11a8062575

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FunctionType = (...args: any[]) => any;
type ActionCreatorsMapObject = { [actionCreator: string]: FunctionType };
export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<
  A[keyof A]
>;
