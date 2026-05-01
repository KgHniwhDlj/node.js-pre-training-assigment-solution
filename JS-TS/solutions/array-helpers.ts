/* eslint-disable @typescript-eslint/no-unused-vars */
// Task 02: Mini functional–utility library
// All helpers are declared but not implemented.

export function mapArray<T, R>(source: readonly T[], mapper: (item: T, index: number) => R): R[] {
  if (!source){
    throw new TypeError('source is null or undefined');
  }

  const result: R[] = [];

  let index = 0;
  for (const item of source) {
    result.push(mapper(item, index)) // Adds the transformed item to the result array
    index++;
  }
  return result;

  //throw new Error('mapArray: not implemented');
}

export function filterArray<T>(source: readonly T[], predicate: (item: T, index: number) => boolean): T[] {
  if (!source){
    throw new TypeError('source is null or undefined');
  }

  const result: T[] = [];

  let index = 0;
  for (const item of source) {
    const filtredItem = predicate(item, index); // Checks whether the item meets the condition

    if (filtredItem){
      result.push(item);
    }

    index++;
  }

  return result;


  //throw new Error('filterArray: not implemented');
}

export function reduceArray<T, R>(source: readonly T[], reducer: (acc: R, item: T, index: number) => R, initial: R): R {
  if (!source){
    throw new TypeError('source is null or undefined');
  }
  
  let acc = initial;

  let index = 0;
  for (const item of source) {
    let reducedArray = reducer(acc, item, index); // computes the next accumulator value
    acc = reducedArray;
    index++;
  }
  return acc;
  //throw new Error('reduceArray: not implemented');
}

export function partition<T>(source: readonly T[], predicate: (item: T) => boolean): [T[], T[]] {
  if (!source){
    throw new TypeError('source is null or undefined');
  }

  const pass: T[] = [];
  const fail: T[] = [];

  for (const item of source) {
    let predicateItem = predicate(item); // Checks whether the item meets the condition
    if(!predicateItem){
      fail.push(item);
    } else {
      pass.push(item);
    }
  }
  return [pass, fail];
  //throw new Error('partition: not implemented');
}

export function groupBy<T, K extends PropertyKey>(source: readonly T[], keySelector: (item: T) => K): Record<K, T[]> {
  if (!source){
    throw new TypeError('source is null or undefined');
  }
  let result = {} as Record<K, T[]>;

  for (const item of source) {
    let itemKey = keySelector(item); // determines the grouping key for the current item
    
    //if the group for this key doesn't exist, initialize it as an empty array
    if (!result[itemKey]) {
      result[itemKey] = [];
    } 

    // adds the current item to its group
    result[itemKey].push(item);
  }

  return result;
  //throw new Error('groupBy: not implemented');
}
