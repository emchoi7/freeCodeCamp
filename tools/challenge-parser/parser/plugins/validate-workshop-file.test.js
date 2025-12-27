import { describe, it, expect } from 'vitest';
import unified from 'unified';
const {
  validateEditableRegionMarkers,
  validateSolutionAtLastStep,
  validateNoSolution
} = require('./validate-workshop-file');

describe('validateEditableRegionMarkers', () => {
  const processor = unified().use(validateEditableRegionMarkers);

  it('should pass when only two editable region markers are present', () => {
    const file = [
      '---',
      'id: test',
      'title: Test',
      '---',
      '--fcc-editable-region--',
      '--fcc-editable-region--'
    ];

    expect(() => {
      processor.runSync(processor.parse(file));
    }).not.toThrow();
  });

  it('should throw error when no editable region markers are present', () => {
    const file = ['---', 'id: test', 'title: Test', '---'];

    expect(() => {
      processor.runSync(processor.parse(file));
    }).toThrow(
      'There should be exactly 2 editable region markers in each workshop file.\nThere are 0 in current file.'
    );
  });

  it('should throw error when only 1 editable region marker is present', () => {
    const file = [
      '---',
      'id: test',
      'title: Test',
      '---',
      '--fcc-editable-region--'
    ];

    expect(() => {
      processor.runSync(processor.parse(file));
    }).toThrow(
      'There should be exactly 2 editable region markers in each workshop file.\nThere are 1 in current file.'
    );
  });
});

describe('validateNoSolution', () => {
  const processor = unified().use(validateNoSolution);

  it('should pass when no solutions markers are present', () => {
    const file = ['---', 'id: test', 'title: Test', '---'];

    expect(() => {
      processor.runSync(processor.parse(file));
    }).not.toThrow();
  });

  it('should throw error when solutions markers are present', () => {
    const file = ['---', 'id: test', 'title: Test', '---', '--solutions--'];

    expect(() => {
      processor.runSync(processor.parse(file));
    }).toThrow(
      'Solutions should only be present at the last step of the workshop.'
    );
  });
});

describe('validateSolutionAtLastStep', () => {
  const processor = unified().use(validateSolutionAtLastStep);
  it('should pass when solutions markers are present', () => {
    const file = ['---', 'id: test', 'title: Test', '---', '--solutions--'];

    expect(() => {
      processor.runSync(processor.parse(file));
    }).not.toThrow();
  });

  it('should throw error when no solutions markers are present', () => {
    const file = ['---', 'id: test', 'title: Test', '---'];

    expect(() => {
      processor.runSync(processor.parse(file));
    }).toThrow('Last step of workshop should have solutions.');
  });
});
