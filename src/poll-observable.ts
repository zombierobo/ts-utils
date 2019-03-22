import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

const DeciderActionConstants = {
  Stop: 'Stop',
  Continue: 'Continue'
};

interface DeciderAction {
  type: string;
  nextStartDelay?: number;
}

export const continueAction = (nextStartDelay?: number): DeciderAction => ({
  type: DeciderActionConstants.Continue,
  nextStartDelay
});

export const stopAction = (): DeciderAction => ({
  type: 'Stop'
});

interface PollObservableResponse {
  forceCancelFn: () => void;
  closed: () => boolean;
}

interface PollEventHistoryItem<NextType, ErrorType> {
  data?: NextType;
  error?: ErrorType;
  isError: boolean;
}

interface DeciderFunctionProps<NextType, ErrorType> {
  data: NextType;
  error: ErrorType;
  isError: boolean;
  history: PollEventHistoryItem<NextType, ErrorType>[];
}

const helperFn = <NextType, ErrorType>(
  observableFn: (...args: any[]) => Observable<NextType>,
  observableFnArgs: any[],
  deciderFn: (props: DeciderFunctionProps<NextType, ErrorType>) => DeciderAction,
  iterationCount: number,
  debugMode: boolean,
  history: PollEventHistoryItem<NextType, ErrorType>[] = [],
  nextStartDelay?: number
): PollObservableResponse => {

  const clog = (...args: any[]) => debugMode && console.log(`${iterationCount}  :::  `, ...args);

  clog('helperFn :: ', iterationCount);

  let closed = false;
  let timeoutId: any;
  let nextLevelForceCancelFn;
  let subscription: Subscription;


  const abortAndClearResources = () => {
    closed = true;
    clog('Abort and clear resources.');
    if (timeoutId) {
      clog('Clearing timeout of setTimeout.', timeoutId !== undefined);
      clearTimeout(timeoutId);
    } else {
      clog('Not clearing timeout of setTimeout.', timeoutId !== undefined);
    }
    if (subscription && !subscription.closed) {
      clog('Observable subscription closed.', subscription !== undefined);
      subscription.unsubscribe();
    } else {
      clog('Not closing Observable subscription.', subscription !== undefined);
    }
    if (nextLevelForceCancelFn) {
      clog('Closing next level resources.', nextLevelForceCancelFn !== undefined);
      nextLevelForceCancelFn();
    } else {
      clog('Not closing next level resources.', nextLevelForceCancelFn !== undefined);
    }
  };

  const handleUpdate = (isError: boolean, data: NextType, error: ErrorType) => {
    if (closed) {
      return;
    }

    const nextAction = deciderFn({ data, error, isError, history });
    if (nextAction && nextAction.type === DeciderActionConstants.Continue) {
      clog('Next Action == Continue. Hence continue polling');
      timeoutId = setTimeout(
        () => {
          nextLevelForceCancelFn = helperFn(
            observableFn,
            observableFnArgs,
            deciderFn,
            iterationCount + 1,
            debugMode,
            history,
            nextAction.nextStartDelay
          ).forceCancelFn;
        },
        nextStartDelay
      );
      clog('timeout assigned :: ', timeoutId);
    } else {
      clog('Next Action !== Continue. Stopping polling.');
      abortAndClearResources();
    }
    history.push({ isError, data, error });
  };

  const handleNextData = (data: NextType) => handleUpdate(false, data, undefined);
  const handleNextError = (error: ErrorType) => handleUpdate(true, undefined, error);

  subscription = observableFn(...observableFnArgs).subscribe(next => handleNextData(next), error => handleNextError(error));
  clog('subscription assigned :: ', subscription);

  return {
    forceCancelFn: () => abortAndClearResources(),
    closed: () => closed
  };
};

export const pollObservable = <NextType = any, ErrorType = any>(
  observableFn: (...args: any[]) => Observable<NextType>,
  observableFnArgs: any[],
  deciderFn: (props: DeciderFunctionProps<NextType, ErrorType>) => DeciderAction,
  debugMode = false
): PollObservableResponse => {

  const { forceCancelFn, closed } = helperFn(observableFn, observableFnArgs, deciderFn, 1, debugMode);

  return {
    forceCancelFn,
    closed
  };
};
