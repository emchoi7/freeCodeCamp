const find = require('unist-util-find');
const { startNode } = require('./utils/get-section');
const { editableRegionMarker } = require('./add-seed');

// Workshop files should have exactly two editable region markers
function validateEditableRegionMarkers() {
  function transformer(tree) {
    const errors = [];
    const editableRegionNodes = find(tree, startNode(editableRegionMarker));

    if (editableRegionNodes.length !== 2) {
      errors.push(
        `There should be exactly 2 editable region markers in each workshop file.\n` +
          `There are ${editableRegionNodes.length} in current file.`
      );
    }

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }
  }

  return transformer;
}

// Workshop files should only have solutions available at the last step
function validateNoSolution() {
  function transformer(tree) {
    const errors = [];
    const solutionNode = find(tree, startNode(`--solutions--`));

    if (solutionNode) {
      errors.push(
        'Solutions should only be present at the last step of the workshop.'
      );
    }
  }

  return transformer;
}

// Last step of workshop should have solutions available
function validateSolutionAtLastStep() {
  function transformer(tree) {
    const errors = [];
    const solutionNode = find(tree, startNode(`--solutions--`));

    if (!solutionNode) {
      errors.push('Last step of workshop should have solutions.');
    }
  }

  return transformer;
}

module.exports.validateEditableRegionMarkers = validateEditableRegionMarkers;
module.exports.validateNoSolution = validateNoSolution;
module.exports.validateSolutionAtLastStep = validateSolutionAtLastStep;
