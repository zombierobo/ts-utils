// Redux actions typed
// Refer https://medium.com/@martin_hotell/improved-redux-type-safety-with-typescript-2-8-2c11a8062575

type FunctionType = (...args: any[]) => any; // tslint:disable-line
type ActionCreatorsMapObject = { [actionCreator: string]: FunctionType }; // tslint:disable-line
export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<A[keyof A]>;
