import { uuidv4 } from './uuid';

test('it should generate unique ideas for a considerable range', () => {
  const idSet = new Set();
  for (let i = 0; i < 10000; i++) {
    const newId = uuidv4();
    expect(newId.length).toBe(36);
    expect(idSet.has(newId)).toBeFalsy();
    idSet.add(newId);
  }
});
